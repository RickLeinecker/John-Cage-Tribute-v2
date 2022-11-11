// Packages
import 'dart:async';
import 'dart:typed_data';

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:socket_io_client/socket_io_client.dart';
import 'package:mic_stream/mic_stream.dart';

// Pages
import 'HomePage.dart';

// Providers for state management
final appTitle = Provider<String>((_) => "John Cage Tribute");

final storage =
    Provider<FlutterSecureStorage>((_) => const FlutterSecureStorage());

final socketProvider = Provider.autoDispose<Socket>((ref) {
  Socket socket = io("http://192.168.50.176:8080/",
      OptionBuilder().setTransports(["websocket"]).build());

  ref.onDispose(() => socket.dispose());

  return socket;
});

final micProvider = StreamProvider<Uint8List>((ref) async* {
  Stream<Uint8List>? micStream = await MicStream.microphone(sampleRate: 44100);
  StreamSubscription micListener = micStream.listen();

  return;
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
    final stateTest = ref.watch(appTitle);
    return MaterialApp(
        home: HomePage(title: stateTest),
        title: stateTest,
        theme: ThemeData(
          primarySwatch: Colors.deepPurple,
          visualDensity: VisualDensity.adaptivePlatformDensity,
        ));
  }
}
