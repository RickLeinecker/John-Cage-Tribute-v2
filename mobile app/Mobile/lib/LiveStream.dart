import 'dart:async';
import 'dart:typed_data';

import 'package:flutter/material.dart';
import 'package:socket_io_client/socket_io_client.dart';
import 'package:permission_handler/permission_handler.dart';
import 'package:mic_stream/mic_stream.dart';

Socket serverSocket = io("http://192.168.12.117:8080/",
    OptionBuilder().setTransports(["websocket"]).build());

class LiveStream extends StatelessWidget {
  LiveStream({Key? key, required this.title}) : super(key: key);
  final String title;

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
      serverSocket.emit("standby");
    });

    // Microphone initialization:
    // Ensure user gives mic permissions and that stream is set up
    initMic();

    // const interval = Duration(seconds: 2);

    // numberStream(interval, 10).listen((num) {
    //   print('Streaming: ${num}');
    // });

    return Scaffold(
      appBar: AppBar(
        title: Text(title),
      ),
      body: Center(
        child: TextButton(
          onPressed: () {
            joinStream();
          },
          child: const Text('Test SocketIO connection'),
        ),
      ),
    );
  }

  void joinStream() async {
    print("Hello?");
    var package = {"email": "danielho96@gmail.com", "password": "tarakavas1"};

    serverSocket.emit("joinStream", package);

    serverSocket.on('event', (data) => print(data));
    serverSocket.on('error', (err) => print(err));
    serverSocket.on('timeout', (time) => print(time));
    serverSocket.on('fromServer', (_) => print(_));
    serverSocket.on('disconnect', (disconn) {
      print(disconn);
      micListener?.cancel();
    });

    // Start listening to microphone
    micStream = await MicStream.microphone(sampleRate: 44100);
    micListener = micStream?.listen((data) {
      serverSocket.emit("audio", data);
      print(data);
    });
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

// STEP1:  Stream setup
class StreamSocket {
  final _socketResponse = StreamController<String>();

  void Function(String) get addResponse => _socketResponse.sink.add;

  Stream<String> get getResponse => _socketResponse.stream;

  void dispose() {
    _socketResponse.close();
  }
}

StreamSocket streamSocket = StreamSocket();

//STEP2: Add this function in main function in main.dart file and add incoming data to the stream
void connectAndListen() {
  Socket socket = io('http://192.168.12.117:8080/',
      OptionBuilder().setTransports(['websocket']).build());

  socket.onConnect((_) {
    print('connect');
    socket.emit('msg', 'test');
  });

  //When an event recieved from server, data is added to the stream
  socket.on('event', (data) => streamSocket.addResponse);
  socket.onDisconnect((_) => print('disconnect'));
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