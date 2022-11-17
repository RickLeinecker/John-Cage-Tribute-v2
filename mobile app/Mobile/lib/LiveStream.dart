import 'dart:async';
import 'dart:typed_data';

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutterapp/main.dart';
import 'package:socket_io_client/socket_io_client.dart';
import 'package:permission_handler/permission_handler.dart';
import 'package:mic_stream/mic_stream.dart';

// Local packages
import './CustomPackages/popups.dart';
import './HomePage.dart';

Stream<Uint8List>? micStream;
StreamSubscription<Uint8List>? micListener;

int roomId = 1;

late Socket socket;

final joinedProvider = StateProvider<bool>((ref) {
  return false;
});

final startedProvider = StateProvider<bool>((ref) {
  return false;
});

final listeningProvider = StateProvider<bool>((ref) {
  return false;
});

class LiveStream extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // Providers here:
    socket = ref.watch(socketProvider);
    bool joined = ref.watch(joinedProvider);
    bool started = ref.watch(startedProvider);
    bool listening = ref.watch(listeningProvider);

    String username = ref.watch(userProvider);
    int userId = ref.watch(idProvider);

    return Scaffold(
        appBar: AppBar(
          title: Text("Join an event!"),
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
                  children: !joined
                      ? [
                          const Padding(padding: EdgeInsets.only(bottom: 350)),
                          ElevatedButton(
                            onPressed: () {
                              joinStream(context, ref, userId);
                              joined = !joined;
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
                                  leaveStream(ref);
                                  started = !started;
                                  joined = !joined;
                                },
                                child: const Text("Leave Concert"),
                                style: ElevatedButton.styleFrom(
                                    fixedSize: const Size(150, 80),
                                    backgroundColor: Colors.redAccent),
                              ),
                            ])),
        ));
  }

  void joinStream(BuildContext context, WidgetRef ref, int userId) async {
    print('We should be joining the room now...');

    var member = {"role": 1, "userId": userId, "isHost": false};
    var package = {"member": member, "roomId": roomId};

    socket.emit("joinroom", package);

    socket.on("joinerror", (err) => displayErr(context, err));
    socket.on("roomerror", (err) => displayErr(context, err));

    socket.on("joinsuccess", (data) {
      socket.off("joinerror");
      socket.off("roomerror");

      ref.read(joinedProvider.notifier).state = true;
    });

    socket.on('disconnect', (disconn) {
      print(disconn);
      micListener?.cancel();

      ref.read(joinedProvider.notifier).state = false;
      ref.read(startedProvider.notifier).state = false;
      ref.read(listeningProvider.notifier).state = false;
    });

    socket.on("audiostart", (message) async {
      print(message);

      ref.read(startedProvider.notifier).state = true;
      ref.read(listeningProvider.notifier).state = true;

      // Start listening to microphone
      micStream = await MicStream.microphone(
        sampleRate: 44100,
      );

      micListener = micStream?.listen((data) {
        socket.emit("sendaudio", data);
      });
    });

    socket.on("audiostop", (message) async {
      ref.read(joinedProvider.notifier).state = false;
      ref.read(startedProvider.notifier).state = false;

      print("Should be stopping now!");

      // Display message letting user know their time ran out
      micListener?.cancel();
      micStream = null;

      socket.close();

      // Pop back to the homepage
      Navigator.of(context).pop();
      Navigator.pushReplacement(
          context,
          MaterialPageRoute(
            builder: (context) => HomePage(),
          ));
    });
  }

  void leaveStream(WidgetRef ref) {
    socket.emit("leaveroom", roomId);

    ref.read(joinedProvider.notifier).state = false;
    ref.read(startedProvider.notifier).state = false;

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
