// Dependencies
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:flutterapp/main.dart';
import 'package:jwt_decoder/jwt_decoder.dart';

// Pages
import 'SignUp.dart';
import 'Login.dart';
import 'LiveStream.dart';
import 'CreateRoom.dart';

class HomePage extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    bool loggedIn = false;

    return Scaffold(
      appBar: AppBar(
        title: Text("Sign Up"),
        actions: loggedIn
            ? [
                ElevatedButton(
                  onPressed: () {
                    storage.delete(key: 'jctacc');
                  },
                  child: const Text("Logout"),
                )
              ]
            : [
                ElevatedButton(
                  onPressed: () => Navigator.push(context,
                      MaterialPageRoute(builder: ((context) {
                    return LoginPage();
                  }))),
                  child: const Text("Login"),
                ),
                ElevatedButton(
                  onPressed: () => Navigator.push(context,
                      MaterialPageRoute(builder: ((context) {
                    return SignUp();
                  }))),
                  child: const Text("Sign Up"),
                ),
              ],
      ),
      body: Container(
          width: double.infinity,
          decoration: const BoxDecoration(
              image: DecorationImage(
            image: AssetImage('images/college_bg.jpg'),
            fit: BoxFit.cover,
          )),
          child: Column(children: [
            const Padding(
                padding: EdgeInsets.fromLTRB(100.0, 75.0, 100.0, 150.0),
                child: Text('John Cage Tribute',
                    style: TextStyle(
                        color: Colors.black,
                        fontSize: 42,
                        fontWeight: FontWeight.bold),
                    textAlign: TextAlign.center)),
            const SizedBox(height: 20),
            // Infobox
            Padding(
                padding: const EdgeInsets.fromLTRB(50.0, 25.0, 50.0, 25.0),
                child: Container(
                    height: 150,
                    width: 1000,
                    decoration: BoxDecoration(
                        color: Colors.white.withOpacity(0.85),
                        border: Border.all(color: Colors.black, width: 2),
                        borderRadius: BorderRadius.circular(5)),
                    child: Center(
                        child: Text(
                      loggedIn
                          ? "Welcome, ${ref.watch(userProvider.notifier)}!\n\n\nPictured: Black Mountain College, where John Cage taught many of his "
                              "students in avant-garde music. Here, he organized the first \"Happening.\""
                          : "Pictured: Black Mountain College, where John Cage taught many of his "
                              "students in avant-garde music. Here, he organized the first \"Happening.\"",
                      style: const TextStyle(
                        color: Colors.black,
                        fontWeight: FontWeight.w500,
                        fontSize: 14,
                        letterSpacing: 2,
                      ),
                      textAlign: TextAlign.center,
                    )))),
            // buttons
            Padding(
              padding:
                  const EdgeInsets.symmetric(vertical: 10.0, horizontal: 75.0),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                children: [
                  ElevatedButton(
                    onPressed: () => Navigator.push(context,
                        MaterialPageRoute(builder: ((context) {
                      return CreateRoom();
                    }))),
                    style: ButtonStyle(
                      backgroundColor:
                          MaterialStateProperty.all(Colors.lightBlue[300]),
                    ),
                    child: const Text(
                      "Host Concert",
                      style: TextStyle(color: Colors.black),
                    ),
                  ),
                  ElevatedButton(
                    onPressed: () => Navigator.push(context,
                        MaterialPageRoute(builder: ((context) {
                      return const LiveStream(
                          title: "John Cage Tribute Livestream");
                    }))),
                    style: ButtonStyle(
                      backgroundColor:
                          MaterialStateProperty.all(Colors.lightBlue[300]),
                    ),
                    child: const Text(
                      "Join Concert",
                      style: TextStyle(color: Colors.black),
                    ),
                  ),
                ],
              ),
            ),
          ])),
    );
  }
}
