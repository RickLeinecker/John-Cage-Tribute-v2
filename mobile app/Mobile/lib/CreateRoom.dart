import 'dart:async';
import 'dart:typed_data';

import 'package:flutter/material.dart';
import 'package:socket_io_client/socket_io_client.dart';
import 'package:permission_handler/permission_handler.dart';
import 'package:mic_stream/mic_stream.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:jwt_decoder/jwt_decoder.dart';

// Testing
Socket serverSocket = io("http://192.168.12.176:8080/",
    OptionBuilder().setTransports(["websocket"]).build());

// Socket serverSocket = io("http://192.168.12.116:8080/",
//     OptionBuilder().setTransports(["websocket"]).build());

// Socket serverSocket = io("http://192.168.12.11:8080/",
//     OptionBuilder().setTransports(["websocket"]).build());

// Socket serverSocket = io("http://172.26.93.159:8080/",
//     OptionBuilder().setTransports(["websocket"]).build());

// Live
// Socket serverSocket = io("https://johncagetribute.org/",
//     OptionBuilder().setTransports(["websocket"]).build());

Stream<Uint8List>? micStream;
StreamSubscription<Uint8List>? micListener;
bool isListening = false;

final storage = new FlutterSecureStorage();

const roomId = 33;
var token = '';
var uId = -1;
var numUsers = 0;

class CreateRoom extends StatefulWidget {
  CreateRoom({Key? key, required this.title}) : super(key: key);
  final String title;

  @override
  State<CreateRoom> createState() => _CreateRoomState();
}

class _CreateRoomState extends State<CreateRoom> {
  bool created = false, started = false;

  @override
  Widget build(BuildContext context) {
    // serverSocket.on(
    //     "connect_error", (err) => print("Socket failed due to ${err.message}"));

    print("Created: ${created}");
    print("Started: ${started}");
    print("Mic status: ${isListening}");

    serverSocket.onConnectError((data) => displayErr(context, data));

    serverSocket.on("connect", (socket) {
      print("Connected to server!");
    });

    // serverSocket.on("updaterooms", (room) {
    //   print("Updated rooms: ${room[roomId]['currentPerformers']}");
    // });

    return WillPopScope(
        onWillPop: () async {
          // Disconnect websocket here
          serverSocket.clearListeners();
          serverSocket.disconnect();
          serverSocket.close();

          Navigator.pop(context);
          return true;
        },
        child: Scaffold(
            appBar: AppBar(
              title: Text(widget.title),
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
                                  schedule();
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
                                            leave();
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
                                            startConcert();
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
                                      stopConcert();
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
                                    onPressed: () =>
                                        {isListening ? mute() : unmute()},
                                  )
                                ])),
            )));
  }

  // Functions that interact with the server code
  schedule() async {
    if (!serverSocket.connected) {
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

      serverSocket.emit("createroom", package);

      serverSocket.on("scheduleerror", (err) {
        created = false;

        setState(() {
          print("State has been set!");
        });

        displayErr(context, err);
      });

      serverSocket.on("schedulesuccess", (message) {
        print(message);
        created = true;

        numUsers = 1;

        setState(() {
          print("State has been set!");
        });
      });

      setState(() {
        print("State has been set!");
      });
    }
  }

  void leave() async {
    serverSocket.emit("leaveroom", roomId);

    setState(() {
      print("State has been set!");
    });
  }

  void startConcert() async {
    serverSocket.emit("startsession", roomId);

    serverSocket.on("audiostart", (message) async {
      print(message);

      // Start listening to microphone
      micStream = await MicStream.microphone(
        sampleRate: 44100,
      );

      micListener = micStream?.listen((data) {
        serverSocket.emit("sendaudio", data);
      });
      isListening = true;
    });

    setState(() => print("setstate"));
  }

  void stopConcert() async {
    micListener?.pause();
    isListening = false;

    var package = {"roomId": roomId, "composition": {}};

    serverSocket.emit("endsession", package);

    setState(() => print("setstate"));
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

  void mute() async {
    const payload = {'roomId': roomId, 'isActive': false};
    serverSocket.emit("muteordeafen", payload);

    // await micListener?.cancel();
    setState(() => print("setstate"));
  }

  void unmute() {
    const payload = {'roomId': roomId, 'isActive': true};
    serverSocket.emit("muteordeafen", payload);

    // micListener = micStream?.listen((data) {
    //   serverSocket.emit("sendaudio", data);
    // });
    setState(() => print("setstate"));
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
