import 'dart:async';
import 'dart:typed_data';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:socket_io_client/socket_io_client.dart';
import 'package:permission_handler/permission_handler.dart';
import 'package:mic_stream/mic_stream.dart';

// Testing
Socket serverSocket = io("http://192.168.12.116:3000/",
    OptionBuilder().setTransports(["websocket"]).build());

// Live
// Socket serverSocket = io("https://johncagetribute.org/",
//     OptionBuilder().setTransports(["websocket"]).build());

var _pinController = new TextEditingController();
var _roomController = new TextEditingController();

class LiveStream extends StatefulWidget {
  const LiveStream({Key? key, required this.title}) : super(key: key);
  final String title;

  @override
  State<LiveStream> createState() => _LiveStreamState();
}

class _LiveStreamState extends State<LiveStream> {
  Stream<Uint8List>? micStream;

  StreamSubscription<Uint8List>? micListener;

  Stream<int> numberStream(Duration interval, [int? maxCount]) async* {
    int i = 0;

    while (true) {
      await Future.delayed(interval);
      yield i++;
      if (i == maxCount) break;
    }
  }

  @override
  Widget build(BuildContext context) {
    serverSocket.on("connect", (socket) {
      print("Connected to server!");
    });

    serverSocket.on("updaterooms", (rooms) => {});

    serverSocket.emitBuffered();

    // Microphone initialization:
    // Ensure user gives mic permissions and that stream is set up
    initMic();

    bool isPressed = false;

    return Scaffold(
      appBar: AppBar(
        title: Text(widget.title),
      ),
      body: Center(
          child: Column(children: [
        TextField(
          controller: _roomController,
          decoration: const InputDecoration(labelText: "Enter room number:"),
          keyboardType: TextInputType.number,
          inputFormatters: <TextInputFormatter>[
            FilteringTextInputFormatter.digitsOnly
          ],
        ),
        TextField(
          controller: _pinController,
          decoration: const InputDecoration(labelText: "Passcode:"),
        ),
        TextButton(
            onPressed: () {
              isPressed ? leaveStream() : joinStream();
              isPressed = !isPressed;
            },
            child: isPressed ? Text('Leave') : Text('Join')),
      ])),
    );
  }

  void joinStream() async {
    var pin = _pinController.text.trim();
    var room = int.parse(_roomController.text.trim());

    print("ROOM NUMBER: ${room}");

    var pinPackage = {"roomId": room, "enteredPin": pin};

    serverSocket.emit("verifypin", pinPackage);

    serverSocket.on("pinerror", (err) {
      print(err);
      return;
    });

    serverSocket.on("pinsuccess", (_) {
      var member = {"role": 1, "userId": 7, "isHost": false};
      var package = {"member": member, "roomId": room};

      serverSocket.emit("joinroom", package);

      serverSocket.on("joinerror", (err) => print(err));
      serverSocket.on("roomerror", (err) => print(err));
    });

    serverSocket.on('event', (data) => print(data));
    serverSocket.on('error', (err) => print(err));
    serverSocket.on('timeout', (time) => print(time));
    serverSocket.on('fromServer', (_) => print(_));
    serverSocket.on('disconnect', (disconn) {
      print(disconn);
      micListener?.cancel();
    });

    // // Start listening to microphone
    // micStream = await MicStream.microphone(sampleRate: 8000);
    // micListener = micStream?.listen((data) {
    //   serverSocket.emit("audio", data);
    //   print(data);
    // });
  }

  void leaveStream() {
    serverSocket.emit("leaveroom", 3);

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