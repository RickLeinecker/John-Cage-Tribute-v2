import 'dart:async';
import 'dart:typed_data';

import 'package:flutter/material.dart';
import 'package:flutterapp/main.dart';
import 'package:socket_io_client/socket_io_client.dart';
import 'package:permission_handler/permission_handler.dart';
import 'package:mic_stream/mic_stream.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

Stream<Uint8List>? micStream;
StreamSubscription<Uint8List>? micListener;
bool isListening = false;

final storage = new FlutterSecureStorage();

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

class CreateRoom extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // Get refs from riverpod
    Socket socket = ref.watch(socketProvider);
    bool created = ref.read(createdProvider.notifier).state;
    bool started = ref.read(startedProvider.notifier).state;

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
                                  schedule(socket);
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
                                            leave(socket);
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
                                            startConcert(socket);
                                            started = !started;
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
                                      stopConcert(socket);
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
                                    icon: isListening
                                        ? Icon(Icons.mic_off_sharp)
                                        : Icon(Icons.mic),
                                    onPressed: () => {
                                      isListening
                                          ? mute(socket)
                                          : unmute(socket)
                                    },
                                  )
                                ])),
            )));
  }

  // Functions that interact with the server code
  schedule(Socket socket) async {
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

      var member = {"role": 1, "userId": 1, "isHost": true};

      var package = {"room": room, "member": member};

      socket.emit("createroom", package);

      socket.on("scheduleerror", (err) {
        created = false;

        // setState(() {
        //   print("State has been set!");
        // });

        //displayErr(context, err);
      });

      socket.once("schedulesuccess", (message) {
        print(message);
        created = true;

        numUsers = 1;

        socket.off("scheduleerror");

        // setState(() {
        //   print("State has been set!");
        // });
      });

      // setState(() {
      //   print("State has been set!");
      // });
    }
  }

  void leave(Socket socket) async {
    socket.emit("leaveroom", roomId);

    // setState(() {
    //   print("State has been set!");
    // });
  }

  void startConcert(Socket socket) async {
    socket.emit("startsession", roomId);

    socket.on("audiostart", (message) async {
      print(message);

      // Start listening to microphone
      micStream = await MicStream.microphone(
        sampleRate: 44100,
      );

      micListener = micStream?.listen((data) {
        socket.emit("sendaudio", data);
      });
      isListening = true;
    });

    //setState(() => print("setstate"));
  }

  void stopConcert(Socket socket) async {
    micListener?.pause();
    isListening = false;

    var package = {"roomId": roomId, "composition": {}};

    socket.emit("endsession", package);

    // Stop listening to
    socket.off("audiostart");

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

final statesProvider = StateNotifierProvider<StatesNotifier, States>((ref) {
  return StatesNotifier();
});

// Class to handle the state of created/started bools
@immutable
class States {
  const States({this.created = false, this.started = false});

  final bool created;
  final bool started;

  States copyWith({bool? created, bool? started}) {
    return States(
        created: created ?? this.created, started: started ?? this.started);
  }
}

class StatesNotifier extends StateNotifier<States> {
  StatesNotifier() : super(const States());

  void changeCreated(bool newCreated) {
    state = States(created: newCreated);
  }

  void changeStarted(bool newStarted) {
    state = States(started: newStarted);
  }
}

/*
websocket setup
class _ListenScreenState extends State<ListenScreen> {
	WebSocketChannel wsChannel;
	Timer timer;

	void initState() {
		wsChannel = IOWebSocketChannel.connect('ws://ade18054.ngrok.io/listen');
		timer = new Timer.periodic(
			Duration(milliseconds: 10), (Timer t) {
				wsChannel.sink.add("Gimme audio!");
			});

		super.initState();
	}

	stream

	Widget build(BuildContext context) {
		return StreamBuilder(
			stream: wsChannel.stream,
			builder: (BuildContext context, AsyncSnapshot snapshot) {
				if (!snapshot.hasData) {
					return Center(
						child: CircularProgressIndicator(),
					);
				}

				final audioData = snapshot.data;
				return Scaffold(
					appBar: AppBar(
						title: Text('Listening Screen'),
					),
					body: Center(
						child: Text('Audio data length is ${audioData.length}.'),
					),
 */
