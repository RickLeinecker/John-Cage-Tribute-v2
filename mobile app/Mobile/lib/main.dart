// Packages
import 'dart:async';
import 'dart:io';
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
  return storage;
});

// Providers holding onto login information
final userProvider = StateProvider<String>((ref) {
  return '';
});

final idProvider = StateProvider<int>((ref) {
  return -1;
});

final loggedProvider = StateProvider<bool>((ref) {
  return false;
});

// Providers for functionality - websockets and mic
final socketProvider = Provider.autoDispose<Socket>((ref) {
  // Server socket to be shared across pages
  // For local, use "http://192.168.50.80:8080"
  // In production, use "https://johncagetribute.org/"
  Socket socket = io("http://192.168.50.80:8080/",
      OptionBuilder().setTransports(["websocket"]).build());
  socket.on("connect", (_) => print("Connected!"));

  ref.onDispose(() {
    socket.dispose();
    print("Socket disposed.");
  });

  return socket;
});

final micProvider =
    StreamProvider.autoDispose<Stream<Uint8List>?>((ref) async* {
  Stream<Uint8List>? micStream = await MicStream.microphone(sampleRate: 22050);

  ref.onDispose(() {
    print("Mic disposed.");
  });

  yield micStream;
});

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const ProviderScope(child: MyApp()));
}

class MyApp extends ConsumerWidget {
  const MyApp({Key? key}) : super(key: key);

  // Check if user is already logged in upon opening the app
  void checkLoggedIn(WidgetRef ref) async {
    final storage = ref.watch(storageProvider);
    var token = await storage.read(key: "jctacc");
    var decoded = JwtDecoder.tryDecode(token.toString());

    // If a token was successfully retrieved, user is logged in
    if (decoded != null) {
      ref.read(userProvider.notifier).state = decoded['username'];
      ref.read(idProvider.notifier).state = decoded['userId'];
      ref.read(loggedProvider.notifier).state = true;
    }
  }

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    checkLoggedIn(ref);

    return MaterialApp(
        home: HomePage(),
        title: "John Cage Tribute",
        theme: ThemeData(
          primarySwatch: Colors.deepPurple,
          visualDensity: VisualDensity.adaptivePlatformDensity,
        ));
  }
}
