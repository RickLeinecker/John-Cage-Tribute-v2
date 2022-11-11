// Dependencies
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:jwt_decoder/jwt_decoder.dart';

// Pages
import 'SignUp.dart';
import 'Login.dart';
import 'LiveStream.dart';
import 'CreateRoom.dart';

const storage = FlutterSecureStorage();

var token;
bool loggedIn = false;

class HomePage extends StatefulWidget {
  const HomePage({Key? key, required this.title}) : super(key: key);
  final String title;

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  var userName = '';
  Future<void> loadToken() async {
    if (userName != '') {
      return;
    }
    token = await storage.read(key: 'jctacc');

    print(token);

    if (token != null) {
      Map<String, dynamic> decoded = JwtDecoder.decode(token);
      bool expired = JwtDecoder.isExpired(token);

      print(decoded);

      userName = decoded['username'];
      loggedIn = true;

      print(loggedIn);

      setState(() {
        print("State has been set!");
      });
    }
  }

  void logOut() {
    storage.delete(key: 'jctacc');
    loggedIn = false;

    setState(() {
      print("State has been set!");
    });
  }

  @override
  Widget build(BuildContext context) {
    //Map<String, dynamic> decoded = JwtDecoder.decode(token);

    loadToken();

    //print(decoded);

    return Scaffold(
      appBar: AppBar(
        title: Text(widget.title),
        actions: loggedIn
            ? [
                ElevatedButton(
                  onPressed: () => logOut(),
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
                    return const SignUp(title: "John Cage Tribute Signup");
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
                          ? "Welcome, $userName!\n\n\nPictured: Black Mountain College, where John Cage taught many of his "
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
                      return CreateRoom(title: "Create Room");
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
