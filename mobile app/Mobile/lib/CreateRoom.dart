import 'dart:async';
import 'dart:typed_data';

import 'package:flutter/material.dart';
import 'package:socket_io_client/socket_io_client.dart';
import 'package:permission_handler/permission_handler.dart';
import 'package:mic_stream/mic_stream.dart';

Socket serverSocket = io("http://192.168.12.117:3000/",
    OptionBuilder().setTransports(["websocket"]).build());

Stream<Uint8List>? micStream;

StreamSubscription<Uint8List>? micListener;

class CreateRoom extends StatefulWidget {
  CreateRoom({Key? key, required this.title}) : super(key: key);
  final String title;

  @override
  State<CreateRoom> createState() => _CreateRoomState();
}

class _CreateRoomState extends State<CreateRoom> {
  Stream<int> numberStream(Duration interval, [int? maxCount]) async* {
    int i = 0;

    while (true) {
      await Future.delayed(interval);
      yield i++;
      if (i == maxCount) break;
    }
  }

  bool created = false, started = false;

  List<TextButton> whichButtons() {
    var buttons = new List<TextButton>.empty();

    var bu = new List<TextButton>.empty();

    if (!created) {
      buttons.add(
        TextButton(
          onPressed: () {
            created ? leave() : schedule();
            created = !created;
          },
          child:
              created ? const Text('Leave Room') : const Text('Create a Room'),
        ),
      );
    } else {
      buttons.add(TextButton(
          onPressed: () {
            created ? leave() : schedule();
            created = !created;
          },
          child: const Text("Leave Room")));

      buttons.add(TextButton(
        onPressed: () {
          created ? leave() : schedule();
          created = !created;
        },
        child: const Text('Start Concert'),
      ));
    }

    return buttons;
  }

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
      body: Center(
          child: Column(
              children: !created
                  ? [
                      TextButton(
                        onPressed: () {
                          schedule();
                          created = !created;
                        },
                        child: const Text('Create a Room'),
                      )
                    ]
                  : !started
                      ? [
                          TextButton(
                              onPressed: () {
                                leave();
                                created = !created;
                              },
                              child: const Text("Leave Room")),
                          TextButton(
                            onPressed: () {
                              startConcert();
                              started = !started;
                            },
                            child: const Text('Start Concert'),
                          )
                        ]
                      : [
                          TextButton(
                              onPressed: () {
                                stopConcert();
                                started = !started;
                              },
                              child: const Text("Stop Concert")),
                        ])),
    );
  }

  // Functions that interact with the server code
  void schedule() async {
    var room = {
      "members": {},
      "id": 3,
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

  void leave() async {
    serverSocket.emit("leaveroom", 3);

    print("I'm leaving! Bye!");

    setState(() {
      print("State has been set!");
    });
  }

  void startConcert() async {
    serverSocket.emit("startsession", 3);

    serverSocket.on("audiostart", (message) async {
      print(message);

      // Start listening to microphone
      micStream = await MicStream.microphone(sampleRate: 22050);
      micListener = micStream?.listen((data) {
        serverSocket.emit("sendaudio", data);
        print(data);
      });
    });

    setState(() => print("setstate"));
  }

  void stopConcert() async {
    serverSocket.emit("endsession", 3);

    print("We should have stopped...");
    micListener?.cancel();

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
