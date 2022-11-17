import 'dart:async';
import 'dart:typed_data';

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutterapp/main.dart';
import 'package:socket_io_client/socket_io_client.dart';
import 'package:permission_handler/permission_handler.dart';
import 'package:mic_stream/mic_stream.dart';

// Local packages
import './CustomPackages/popups.dart';

Stream<Uint8List>? micStream;
StreamSubscription<Uint8List>? micListener;

int roomId = 1;

late Socket socket;

final joinedProvider = StateProvider<bool>((ref) {
  return false;
});

final startedProvider = StateProvider<bool>((ref) {
  return false;
});

final listeningProvider = StateProvider<bool>((ref) {
  return false;
});

class LiveStream extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // Providers here:
    socket = ref.watch(socketProvider);
    bool joined = ref.watch(joinedProvider);
    bool started = ref.watch(startedProvider);
    bool listening = ref.watch(listeningProvider);

    String username = ref.watch(userProvider);
    int userId = ref.watch(idProvider);

    return Scaffold(
        appBar: AppBar(
          title: Text("Join an event!"),
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
                  children: !joined
                      ? [
                          const Padding(padding: EdgeInsets.only(bottom: 350)),
                          ElevatedButton(
                            onPressed: () {
                              joinStream(context, ref, userId);
                              joined = !joined;
                            },
                            child: const Text('Join a Stream'),
                            style: ElevatedButton.styleFrom(
                                fixedSize: const Size(150, 80),
                                backgroundColor: Colors.blue),
                          )
                        ]
                      : !started
                          ? [
                              const Padding(
                                  padding: EdgeInsets.only(bottom: 350)),
                              Row(
                                  mainAxisAlignment:
                                      MainAxisAlignment.spaceAround,
                                  children: const [
                                    Text("Waiting for host to start...")
                                  ]),
                            ]
                          : [
                              const Padding(
                                  padding: EdgeInsets.only(bottom: 350)),
                              ElevatedButton(
                                onPressed: () {
                                  leaveStream();
                                  started = !started;
                                  joined = !joined;
                                },
                                child: const Text("Leave Concert"),
                                style: ElevatedButton.styleFrom(
                                    fixedSize: const Size(150, 80),
                                    backgroundColor: Colors.redAccent),
                              ),
                            ])),
        ));
  }

  void joinStream(BuildContext context, WidgetRef ref, int userId) async {
    print("ROOM NUMBER: ${roomId}");

    //var pinPackage = {"roomId": roomId, "enteredPin": "abcdefg"};

    // socket.emit("verifypin", pinPackage);

    // socket.on("pinerror", (err) {
    //   ref.read(joinedProvider.notifier).state = false;
    //   displayErr(context, err);
    // });

    print('We should be joining the room now...');

    var member = {"role": 1, "userId": userId, "isHost": false};
    var package = {"member": member, "roomId": roomId};

    socket.emit("joinroom", package);

    print("Successful pin!");

    socket.on("joinerror", (err) => displayErr(context, err));
    socket.on("roomerror", (err) => displayErr(context, err));

    // socket.on("pinsuccess", (_) {
    //   var member = {"role": 1, "userId": 4, "isHost": false};
    //   var package = {"member": member, "roomId": roomId};

    //   socket.emit("joinroom", package);

    //   print("Successful pin!");

    //   socket.on("joinerror", (err) => displayErr(context, err));
    //   socket.on("roomerror", (err) => displayErr(context, err));
    // });

    socket.on('disconnect', (disconn) {
      print(disconn);
      micListener?.cancel();
    });

    socket.on("audiostart", (message) async {
      print(message);

      // Start listening to microphone
      micStream = await MicStream.microphone(
        sampleRate: 44100,
      );
      micListener = micStream?.listen((data) {
        socket.emit("sendaudio", data);
      });
    });

    socket.on("audiostop", (message) async {
      print(message);

      micListener?.cancel();
    });
  }

  void leaveStream() {
    socket.emit("leaveroom", 33);

    micListener?.cancel();
  }
}

void initMic() async {
  var micPerms = Permission.microphone.status;

  if (await micPerms.isDenied) {
    print("Asking for mic permissions.");
    await Permission.microphone.request();
  } else
    print("Permissions already granted!");
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
