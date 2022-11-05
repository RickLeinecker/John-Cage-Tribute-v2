// Dependencies
import 'package:flutter/material.dart';

// Pages
import 'SignUp.dart';
import 'Login.dart';
import 'LiveStream.dart';
import 'CreateRoom.dart';

class HomePage extends StatelessWidget {
  const HomePage({Key? key, required this.title}) : super(key: key);
  final String title;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(title),
        actions: [
          ElevatedButton(
            onPressed: () =>
                Navigator.push(context, MaterialPageRoute(builder: ((context) {
              return new LoginPage(title: "John Cage Tribute Login");
            }))),
            child: const Text("Login"),
          ),
          ElevatedButton(
            onPressed: () =>
                Navigator.push(context, MaterialPageRoute(builder: ((context) {
              return new SignUp(title: "John Cage Tribute Signup");
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
                      "Start Concert",
                      style: TextStyle(color: Colors.black),
                    ),
                  ),
                  ElevatedButton(
                    onPressed: () => Navigator.push(context,
                        MaterialPageRoute(builder: ((context) {
                      return LiveStream(title: "John Cage Tribute Livestream");
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
            Padding(
                padding: const EdgeInsets.fromLTRB(50.0, 25.0, 50.0, 25.0),
                child: Container(
                    height: 100,
                    width: 1000,
                    decoration: BoxDecoration(
                        color: Colors.white.withOpacity(0.85),
                        border: Border.all(color: Colors.black, width: 2),
                        borderRadius: BorderRadius.circular(5)),
                    child: const Center(
                        child: Text(
                      'Pictured: Black Mountain College, where John Cage taught many of his students in avant-garde music. Here, he organized the first \'Happening.\'',
                      style: TextStyle(
                        color: Colors.black,
                        fontWeight: FontWeight.w500,
                        fontSize: 14,
                        letterSpacing: 2,
                      ),
                      textAlign: TextAlign.center,
                    )))),
          ])),
    );
  }
}
