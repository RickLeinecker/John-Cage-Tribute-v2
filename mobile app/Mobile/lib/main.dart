// Packages
import 'dart:async';
import 'dart:typed_data';

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:socket_io_client/socket_io_client.dart';
import 'package:mic_stream/mic_stream.dart';
import 'package:jwt_decoder/jwt_decoder.dart';

// Pages
import 'HomePage.dart';

// Providers for state management
final storageProvider = Provider<FlutterSecureStorage>((ref) {
  const storage = FlutterSecureStorage();
  // Future<String?> token = storage.read(key: "jctacc");
  // Map<String, dynamic> creds = JwtDecoder.decode(token.toString());

  // print("We're here!");

  // ref.read(userProvider.notifier).state = creds['username'];

  // print(creds['username']);
  // print(ref.watch(userProvider.notifier));

  return storage;
});

final userProvider = StateProvider<String>((ref) {
  return '';
});

final socketProvider = Provider.autoDispose<Socket>((ref) {
  // Server socket to be shared across pages
  Socket socket = io("http://192.168.50.80:8080/",
      OptionBuilder().setTransports(["websocket"]).build());
  socket.on("connect", (_) => print("Connected!"));

  ref.onDispose(() {
    socket.dispose();
    print("Disposal!");
  });

  return socket;
});

final micProvider = StreamProvider<Uint8List>((ref) async* {
  Stream<Uint8List>? micStream = await MicStream.microphone(sampleRate: 22050);

  ref.onDispose(() {
    print("Handle garbage collection");
  });

  return;
});

final errorProvider = Provider<Function>((ref) {
  return (BuildContext context, String message) {
    showDialog(
        context: context,
        barrierDismissible: false,
        builder: (BuildContext context) {
          return AlertDialog(
              title: const Text("Error Joining Room"),
              content: Text(message),
              actions: <Widget>[
                TextButton(
                    child: Text("Close"),
                    onPressed: () {
                      Navigator.of(context).pop();
                    })
              ]);
        });
  };
});

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const ProviderScope(child: MyApp()));
}

class MyApp extends ConsumerWidget {
  const MyApp({Key? key}) : super(key: key);

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return MaterialApp(
        home: HomePage(),
        title: "John Cage Tribute",
        theme: ThemeData(
          primarySwatch: Colors.deepPurple,
          visualDensity: VisualDensity.adaptivePlatformDensity,
        ));
  }
}
