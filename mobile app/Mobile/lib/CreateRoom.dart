import 'dart:async';
import 'dart:typed_data';

import 'package:flutter/material.dart';
import 'package:socket_io_client/socket_io_client.dart';
import 'package:permission_handler/permission_handler.dart';
import 'package:mic_stream/mic_stream.dart';

// Testing
// Socket serverSocket = io("http://192.168.12.116:8080/",
//     OptionBuilder().setTransports(["websocket"]).build());

// Socket serverSocket = io("http://192.168.12.11:8080/",
//     OptionBuilder().setTransports(["websocket"]).build());
Socket serverSocket = io("http://172.26.94.38:8080/",
    OptionBuilder().setTransports(["websocket"]).build());

// Live
// Socket serverSocket = io("https://johncagetribute.org/",
//     OptionBuilder().setTransports(["websocket"]).build());

Stream<Uint8List>? micStream;

StreamSubscription<Uint8List>? micListener;

const roomId = 33;

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
    serverSocket.on("connect", (socket) {
      print("Connected to server!");
    });

    serverSocket.on("updaterooms", (rooms) {
      print("Updated rooms: ${rooms}");
    });

    return Scaffold(
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
                          const Padding(padding: EdgeInsets.only(bottom: 350)),
                          ElevatedButton(
                            onPressed: () {
                              schedule();
                              created = !created;
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
                                  padding: EdgeInsets.only(bottom: 350)),
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
                                          backgroundColor: Colors.redAccent),
                                    ),
                                    ElevatedButton(
                                      onPressed: () {
                                        startConcert();
                                        started = !started;
                                      },
                                      child: const Text('Start Concert'),
                                      style: ElevatedButton.styleFrom(
                                          fixedSize: const Size(150, 80),
                                          backgroundColor: Colors.lightGreen),
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
                            ])),
        ));
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

      var member = {"role": 1, "userId": 3, "isHost": true};

      var package = {"room": room, "member": member};

      serverSocket.emit("createroom", package);

      serverSocket.on('event', (data) => print(data));
      serverSocket.on('error', (err) => print(err));
      serverSocket.on('timeout', (time) => print(time));
      serverSocket.on('fromServer', (_) => print(_));
      serverSocket.on('disconnect', (disconn) {
        print(disconn);
        micListener?.cancel();
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
    });

    setState(() => print("setstate"));
  }

  void stopConcert() async {
    micListener?.cancel();

    var package = {"roomId": roomId, "composition": {}};

    serverSocket.emit("endsession", package);

    print("We should have stopped...");

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
