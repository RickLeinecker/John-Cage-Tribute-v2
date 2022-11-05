// Packages
import 'package:flutter/material.dart';
import 'package:socket_io_client/socket_io_client.dart';

// Pagesexit
import 'HomePage.dart';

// Socket _serverSocket = io("http://192.168.12.117:8080/",
//     OptionBuilder().setTransports(["websocket"]).build());

void main() async {
  // _serverSocket.onConnect((data) {
  //   print("Connected to server!");
  // });

  // print("Hello?");

  // _serverSocket.on('event', (data) => print(data));
  // _serverSocket.on('error', (err) => print(err));
  // _serverSocket.on('timeout', (time) => print(time));
  // _serverSocket.on('fromServer', (_) => print(_));
  // _serverSocket.onDisconnect((_) => print("Disconnected from server."));

  WidgetsFlutterBinding.ensureInitialized();
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'John Cage Tribute',
      theme: ThemeData(
        primarySwatch: Colors.blue,
        visualDensity: VisualDensity.adaptivePlatformDensity,
      ),
      home: const HomePage(title: 'John Cage Tribute'),
    );
  }
}
