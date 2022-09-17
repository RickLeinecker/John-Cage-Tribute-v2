import 'package:flutter/material.dart';

class LiveStream extends StatelessWidget {
  const LiveStream({Key? key, required this.title}) : super(key: key);
  final String title;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(title),
      ),
      body: Center(
        child: TextButton(
          onPressed: () {},
          child: const Text('Go Back'),
        ),
      ),
    );
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