import 'dart:async';
import 'dart:typed_data';
import 'dart:math';

import 'package:flutter/material.dart';
import 'package:flutterapp/main.dart';
import 'package:socket_io_client/socket_io_client.dart';
import 'package:permission_handler/permission_handler.dart';
import 'package:mic_stream/mic_stream.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:audio_streamer/audio_streamer.dart';
import 'package:flutter/services.dart';

Stream<Uint8List>? micStream;
StreamSubscription<Uint8List>? micListener;

const roomId = 33;
var token = '';
var uId = -1;
var numUsers = 0;

final createdProvider = StateProvider<bool>((ref) {
  return false;
});

final startedProvider = StateProvider<bool>((ref) {
  return false;
});

final listeningProvider = StateProvider<bool>((ref) {
  return false;
});

class CreateRoom extends ConsumerWidget {
  // New mic stream
  AudioStreamer _streamer = AudioStreamer();
  bool _isRecording = false;
  List<double> _audio = [];

  late Socket socket;

  void onAudio(List<double> buffer) {
    print(buffer);
    _audio.addAll(buffer);
    double secondsRecorded =
        _audio.length.toDouble() / AudioStreamer.sampleRate.toDouble();

    socket.emit("sendaudio", buffer);

    // print(_audio);
    // socket.emit("sendaudio", _audio);
    // _audio.clear();

    //socket.emit("sendaudio", _audio);
    // print('Max amp: ${buffer.reduce(max)}');
    // print('Min amp: ${buffer.reduce(min)}');
    // print('$secondsRecorded seconds recorded.');
    // print('-' * 50);
  }

  void handleError(PlatformException error, WidgetRef ref) {
    ref.read(listeningProvider.notifier).state = false;

    print(error.message);
    print(error.details);
  }

  void start(WidgetRef ref, Socket socket) async {
    try {
      _streamer.start(onAudio, handleError);

      ref.read(listeningProvider.notifier).state = true;
    } catch (error) {
      print(error);
    }
  }

  void stop(WidgetRef ref) async {
    bool stopped = await _streamer.stop();
    ref.read(listeningProvider.notifier).state = stopped;
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // Get refs from riverpod
    socket = ref.watch(socketProvider);
    bool created = ref.watch(createdProvider);
    bool started = ref.watch(startedProvider);
    bool listening = ref.watch(listeningProvider);

    socket.once("connect", (socket) {
      print("Connected to server!");
    });

    // socket.on("updaterooms", (room) {
    //   print("Updated rooms: ${room[roomId]['currentPerformers']}");
    // });

    return WillPopScope(
        onWillPop: () async {
          // Disconnect websocket here
          socket.clearListeners();
          socket.disconnect();
          socket.close();

          Navigator.pop(context);
          return true;
        },
        child: Scaffold(
            appBar: AppBar(
              title: Text("Testing"),
            ),
            body: Container(
              width: double.infinity,
              decoration: const BoxDecoration(
                  image: DecorationImage(
                image: AssetImage('images/college_bg.jpg'),
                fit: BoxFit.cover,
              )),
              child: Center(
                  child: Column(
                      children: !created
                          ? [
                              const Padding(
                                  padding: EdgeInsets.only(bottom: 350)),
                              ElevatedButton(
                                onPressed: () {
                                  schedule(socket, ref, context);
                                },
                                child: const Text('Create a Room'),
                                style: ElevatedButton.styleFrom(
                                    fixedSize: const Size(150, 80),
                                    backgroundColor: Colors.blue),
                              )
                            ]
                          : !started
                              ? [
                                  const Padding(
                                      padding: EdgeInsets.only(bottom: 150)),
                                  Text("Hello"),
                                  const Padding(
                                      padding: EdgeInsets.only(bottom: 150)),
                                  Row(
                                      mainAxisAlignment:
                                          MainAxisAlignment.spaceAround,
                                      children: [
                                        ElevatedButton(
                                          onPressed: () {
                                            leave(socket, ref);
                                            created = !created;
                                          },
                                          child: const Text("Leave Room"),
                                          style: ElevatedButton.styleFrom(
                                              fixedSize: const Size(150, 80),
                                              backgroundColor:
                                                  Colors.redAccent),
                                        ),
                                        ElevatedButton(
                                          onPressed: () {
                                            startConcert(socket, ref);
                                            //started = !started;
                                          },
                                          child: const Text('Start Concert'),
                                          style: ElevatedButton.styleFrom(
                                              fixedSize: const Size(150, 80),
                                              backgroundColor:
                                                  Colors.lightGreen),
                                        )
                                      ]),
                                ]
                              : [
                                  const Padding(
                                      padding: EdgeInsets.only(bottom: 350)),
                                  ElevatedButton(
                                    onPressed: () {
                                      stopConcert(socket, ref);
                                      started = !started;
                                      created = !created;
                                    },
                                    child: const Text("Stop Concert"),
                                    style: ElevatedButton.styleFrom(
                                        fixedSize: const Size(150, 80),
                                        backgroundColor: Colors.redAccent),
                                  ),
                                  // ignore: prefer_const_constructors
                                  IconButton(
                                    icon: listening
                                        ? Icon(Icons.mic_off_sharp)
                                        : Icon(Icons.mic),
                                    onPressed: () => {
                                      listening ? mute(socket) : unmute(socket)
                                    },
                                  )
                                ])),
            )));
  }

  // Functions that interact with the server code
  schedule(Socket socket, WidgetRef ref, BuildContext context) async {
    if (!socket.connected) {
      print("I'm not connected...");

      return const AlertDialog(
        title: Text("HOLD UP"),
        content: Text("Please wait while we connect to the servers..."),
        actions: [Text("OK")],
      );
    } else {
      // Start constructing the room
      var room = {
        "members": {},
        "id": roomId,
        "pin": "abcdefg",
        "currentListeners": 0,
        "maxListeners": 1,
        "currentPerformers": 0,
        "maxPerformers": 2,
        "isOpen": false,
        "sessionStarted": false,
        "sessionAudio": 0
      };

      var member = {"role": 1, "userId": 19, "isHost": true};

      var package = {"room": room, "member": member};

      socket.emit("createroom", package);

      socket.on("scheduleerror", (err) {
        ref.read(createdProvider.notifier).state = false;

        displayErr(context, err);
      });

      // socket.once("schedulesuccess", (message) {
      //   ref.read(createdProvider.notifier).state = true;
      //   numUsers = 1;
      //   socket.off("scheduleerror");
      // });

      ref.read(createdProvider.notifier).state = true;
      numUsers = 1;
      socket.off("scheduleerror");
    }
  }

  void leave(Socket socket, WidgetRef ref) async {
    socket.emit("leaveroom", roomId);

    ref.read(createdProvider.notifier).state = false;
  }

  void startConcert(Socket socket, WidgetRef ref) async {
    socket.emit("startsession", roomId);

    socket.on("audiostart", (message) async {
      ref.read(startedProvider.notifier).state = true;

      start(ref, socket);

      // Start listening to microphone
      // micStream = await MicStream.microphone(
      //     sampleRate: 44100, channelConfig: ChannelConfig.CHANNEL_IN_MONO);

      // micListener = micStream?.listen((data) {
      //   socket.emit("sendaudio", data);
      // });

      ref.read(listeningProvider.notifier).state = true;
    });

    //setState(() => print("setstate"));
  }

  void stopConcert(Socket socket, WidgetRef ref) async {
    //micListener?.pause();

    stop(ref);

    // Send server a package to end the concert,
    // then remove the 'audiostart' listener
    var package = {"roomId": roomId, "composition": {}};
    socket.emit("endsession", package);
    socket.off("audiostart");

    // State management
    ref.read(createdProvider.notifier).state = false;
    ref.read(startedProvider.notifier).state = false;
    ref.read(listeningProvider.notifier).state = false;
    //setState(() => print("setstate"));
  }

  // Mic initialization
  void initMic() async {
    var micPerms = Permission.microphone.status;

    if (await micPerms.isDenied) {
      print("Asking for mic permissions.");
      await Permission.microphone.request();
    } else
      print("Permissions already granted!");
  }

  void mute(Socket socket) async {
    const payload = {'roomId': roomId, 'isActive': false};
    socket.emit("muteordeafen", payload);

    // await micListener?.cancel();
    //setState(() => print("setstate"));
  }

  void unmute(Socket socket) {
    const payload = {'roomId': roomId, 'isActive': true};
    socket.emit("muteordeafen", payload);

    // micListener = micStream?.listen((data) {
    //   socket.emit("sendaudio", data);
    // });
    //setState(() => print("setstate"));
  }

  void displayErr(BuildContext context, String message) {
    showDialog(
        context: context,
        barrierDismissible: false,
        builder: (BuildContext context) {
          return AlertDialog(
              title: const Text("Error Creating Room"),
              content: Text(message),
              actions: <Widget>[
                TextButton(
                    child: Text("Close"),
                    onPressed: () => Navigator.of(context).pop())
              ]);
        });
  }
}
