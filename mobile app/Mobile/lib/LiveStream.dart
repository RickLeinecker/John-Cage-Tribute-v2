import 'dart:async';
import 'dart:typed_data';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:socket_io_client/socket_io_client.dart';
import 'package:permission_handler/permission_handler.dart';
import 'package:mic_stream/mic_stream.dart';

// Testing
Socket serverSocket = io("http://192.168.12.176:8080/",
    OptionBuilder().setTransports(["websocket"]).build());

// Socket serverSocket = io("http://192.168.12.116:8080/",
//     OptionBuilder().setTransports(["websocket"]).build());

// Live
// Socket serverSocket = io("https://johncagetribute.org/",
//     OptionBuilder().setTransports(["websocket"]).build());

Stream<Uint8List>? micStream;
StreamSubscription<Uint8List>? micListener;

void displayErr(BuildContext context, String message) {
  showDialog(
      context: context,
      barrierDismissible: false,
      builder: (BuildContext context) {
        return AlertDialog(
            title: const Text("Error Joining Room"),
            content: Text(message),
            actions: <Widget>[
              FilledButton(
                  child: Text("Close"),
                  onPressed: () => Navigator.of(context).pop())
            ]);
      });
}

class LiveStream extends StatefulWidget {
  const LiveStream({Key? key, required this.title}) : super(key: key);
  final String title;

  @override
  State<LiveStream> createState() => _LiveStreamState();
}

class _LiveStreamState extends State<LiveStream> {
  bool created = false, started = false;

  @override
  Widget build(BuildContext context) {
    serverSocket.on("connect", (socket) {
      print("Connected to server!");
    });

    serverSocket.on("updaterooms", (rooms) {
      print("Updated rooms: ${rooms}");
    });

    serverSocket.on("roomerror", (err) {
      micListener?.cancel();
      displayErr(context, err);
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
                              joinStream();
                              created = !created;
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
                                  created = !created;
                                },
                                child: const Text("Leave Concert"),
                                style: ElevatedButton.styleFrom(
                                    fixedSize: const Size(150, 80),
                                    backgroundColor: Colors.redAccent),
                              ),
                            ])),
        ));
  }

  void joinStream() async {
    var room = 33;

    print("ROOM NUMBER: ${room}");

    var pinPackage = {"roomId": room, "enteredPin": "abcdefg"};

    serverSocket.emit("verifypin", pinPackage);

    serverSocket.on("pinerror", (err) {
      displayErr(context, err);
    });

    print('We should be joining the room now...');

    serverSocket.on("pinsuccess", (_) {
      var member = {"role": 1, "userId": 4, "isHost": false};
      var package = {"member": member, "roomId": room};

      serverSocket.emit("joinroom", package);

      print("Successful pin!");

      serverSocket.on("joinerror", (err) => displayErr(context, err));
      serverSocket.on("roomerror", (err) => displayErr(context, err));
    });

    serverSocket.on('event', (data) => print(data));
    serverSocket.on('error', (err) => displayErr(context, err));
    serverSocket.on('timeout', (time) => print(time));
    serverSocket.on('fromServer', (_) => print(_));
    serverSocket.on('disconnect', (disconn) {
      print(disconn);
      micListener?.cancel();
    });

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

    serverSocket.on("audiostop", (message) async {
      print(message);

      micListener?.cancel();
    });
  }

  void leaveStream() {
    serverSocket.emit("leaveroom", 33);

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
