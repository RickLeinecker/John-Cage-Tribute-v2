// Dependencies
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter/material.dart';
import 'package:flutterapp/main.dart';

// Pages
import 'SignUp.dart';
import 'Login.dart';
import 'LiveStream.dart';
import 'CreateRoom.dart';

class HomePage extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final storage = ref.watch(storageProvider);
    var user = ref.watch(userProvider);
    bool loggedIn = ref.watch(loggedProvider);

    return Scaffold(
      appBar: AppBar(
        title: Text("John Cage Tribute"),
        actions: loggedIn
            ? [
                ElevatedButton(
                  onPressed: () {
                    storage.delete(key: 'jctacc');
                    ref.read(userProvider.notifier).state = '';
                    ref.read(idProvider.notifier).state = -1;
                    ref.read(loggedProvider.notifier).state = false;
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
                // This contains the infobox you see on the homepage
                // Text should change to greet you if you're logged in,
                // otherwise it only displays a fact about the background
                child: Container(
                    height: 150,
                    width: 1000,
                    decoration: BoxDecoration(
                        color: Colors.white.withOpacity(0.85),
                        border: Border.all(color: Colors.black, width: 2),
                        borderRadius: BorderRadius.circular(10)),
                    child: Center(
                        child: Text(
                      // Display different text based on if
                      // user is logged in or not
                      loggedIn
                          ? "Welcome, $user!\n\n\nPictured: Black Mountain College, where John Cage taught many of his "
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
              padding: const EdgeInsets.fromLTRB(50.0, 5.0, 50.0, 0.0),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children:
                    // Action buttons should change depending on loggedin state
                    // Guests shouldn't be able to create a new concert or
                    // join one
                    loggedIn
                        ? [
                            // Logged-in state
                            ElevatedButton(
                              onPressed: () => Navigator.push(context,
                                  MaterialPageRoute(builder: ((context) {
                                return CreateRoom();
                              }))),
                              style: ButtonStyle(
                                backgroundColor: MaterialStateProperty.all(
                                    Colors.lightBlue[300]),
                              ),
                              child: const Text(
                                "Host Concert",
                                style: TextStyle(color: Colors.black),
                              ),
                            ),
                            const SizedBox(width: 20),
                            ElevatedButton(
                              onPressed: () => Navigator.push(context,
                                  MaterialPageRoute(builder: ((context) {
                                return const LiveStream(
                                    title: "John Cage Tribute Livestream");
                              }))),
                              style: ButtonStyle(
                                backgroundColor: MaterialStateProperty.all(
                                    Colors.lightBlue[300]),
                              ),
                              child: const Text(
                                "Join Concert",
                                style: TextStyle(color: Colors.black),
                              ),
                            ),
                          ]
                        :
                        // Logged-out state
                        [
                            Container(
                                height: 75,
                                width: 200,
                                decoration: BoxDecoration(
                                    color: Colors.white.withOpacity(0.85),
                                    border: Border.all(
                                        color: Colors.black, width: 2),
                                    borderRadius: BorderRadius.circular(10)),
                                child: const Center(
                                    child: Text(
                                  "Please sign in or register to join or host a concert!\n",
                                  style: TextStyle(
                                    color: Colors.black,
                                    fontWeight: FontWeight.w500,
                                    fontSize: 14,
                                    letterSpacing: 2,
                                  ),
                                  textAlign: TextAlign.center,
                                )))
                          ],
              ),
            ),
          ])),
    );
  }
}
