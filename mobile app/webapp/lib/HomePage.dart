import 'package:flutter/material.dart';
import 'package:webapp/SearchPage.dart';
import 'package:webapp/Login.dart';
import 'package:webapp/SignUp.dart';
import 'package:webapp/LiveStream.dart';
import 'package:webapp/AudioTest.dart';
import 'package:webapp/DashBoard.dart';

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
                Navigator.push(context, MaterialPageRoute(builder: (context) {
              return const Login(title: 'Login');
            })),
            child: const Text("Login"),
          ),
          ElevatedButton(
            onPressed: () =>
                Navigator.push(context, MaterialPageRoute(builder: (context) {
              return const SignUp(title: 'Sign Up');
            })),
            child: const Text("Sign Up"),
          ),
        ],
      ),
      body: Container(
          width: double.infinity,
          decoration: const BoxDecoration(
              image: DecorationImage(
            image: AssetImage("images/college_bg.jpg"),
            fit: BoxFit.cover,
          )),
          child: Column(children: [
            const Padding(
                padding: EdgeInsets.symmetric(horizontal: 100.0),
                child: Text('John Cage Tribute',
                    style: TextStyle(
                        color: Colors.black,
                        fontSize: 70,
                        fontWeight: FontWeight.bold),
                    textAlign: TextAlign.center)),
            const SizedBox(height: 20),
            Padding(
                padding: const EdgeInsets.symmetric(horizontal: 100.0),
                child: Container(
                    height: 100,
                    width: 600,
                    margin: const EdgeInsets.fromLTRB(0.0, 300.0, 0.0, 0.0),
                    decoration: BoxDecoration(
                        color: Colors.white.withOpacity(0.70),
                        border: Border.all(color: Colors.black, width: 2),
                        borderRadius: BorderRadius.circular(5)),
                    child: const Center(
                        child: Text(
                      'Pictured: Black Mountain College, where John Cage taught many of his students in avant-garde music. Here, he organized the first \'Happening.\'',
                      style: TextStyle(
                        color: Colors.black,
                        fontWeight: FontWeight.w500,
                        fontSize: 18,
                        letterSpacing: 2,
                      ),
                      textAlign: TextAlign.center,
                    )))),
            Padding(
              padding:
                  const EdgeInsets.symmetric(vertical: 10.0, horizontal: 190.0),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                children: [
                  ElevatedButton(
                    onPressed: () => Navigator.push(context,
                        MaterialPageRoute(builder: (context) {
                      return SearchPage(title: 'Search');
                    })),
                    style: ButtonStyle(
                      backgroundColor:
                          MaterialStateProperty.all(Colors.lightBlue[300]),
                    ),
                    child: const Text(
                      "View Recordings",
                      style: TextStyle(color: Colors.black),
                    ),
                  ),
                  ElevatedButton(
                    onPressed: () => Navigator.push(context,
                        MaterialPageRoute(builder: (context) {
                      return const LiveStream(title: 'Live Concert');
                    })),
                    style: ButtonStyle(
                      backgroundColor:
                          MaterialStateProperty.all(Colors.lightBlue[300]),
                    ),
                    child: const Text(
                      "Listen to Live Concert",
                      style: TextStyle(color: Colors.black),
                    ),
                  ),
                ],
              ),
            ),
            //FOR ADMIN USE ONLY DELETE BEFORE DEPLOYING
            Padding(
              padding:
                  const EdgeInsets.symmetric(vertical: 10.0, horizontal: 100.0),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                children: [
                  ElevatedButton(
                    onPressed: () => Navigator.push(context,
                        MaterialPageRoute(builder: (context) {
                      return const AudioTest(title: 'AudioTest');
                    })),
                    style: ButtonStyle(
                      backgroundColor:
                          MaterialStateProperty.all(Colors.lightBlue[300]),
                    ),
                    child: const Text(
                      "Dev Only: AudioTest.dart",
                      style: TextStyle(color: Colors.black),
                    ),
                  ),
                  ElevatedButton(
                    onPressed: () => Navigator.push(context,
                        MaterialPageRoute(builder: (context) {
                      return const DashBoard(title: 'DashBoard');
                    })),
                    style: ButtonStyle(
                      backgroundColor:
                          MaterialStateProperty.all(Colors.lightBlue[300]),
                    ),
                    child: const Text(
                      "Dev Only: Dashboard.dart",
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
