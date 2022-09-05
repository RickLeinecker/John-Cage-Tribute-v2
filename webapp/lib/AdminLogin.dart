// ignore_for_file: prefer_const_constructors

import 'package:flutter/material.dart';
//import 'package:drift/drift.dart' as drift;
import 'package:crypt/crypt.dart';
import 'package:webapp/HomePage.dart';

class AdminLogin extends StatelessWidget {
  AdminLogin({Key? key, required this.title}) : super(key: key);
  final String title;

  // These two variables hold the username and password, respectively
  final _userController = TextEditingController();
  final _passController = TextEditingController();
  final _errController = TextEditingController();

  void signIn(BuildContext context) {
    // Admin login stored here ONLY UNTIL DATABASE IS FULLY FUNCTIONAL
    const adminUser = "JCTDev";
    final passhash =
        Crypt.sha256("JohnCage2022", rounds: 1000, salt: "chanceoperations");

    final h = Crypt(passhash.toString());

    if (adminUser == _userController.text.trim() &&
        h.match(_passController.text.trim())) {
      Navigator.push(context, MaterialPageRoute(builder: (context) {
        return const HomePage(title: 'HomePage');
      }));
    } else {
      print('ERR: Incorrect username or password');
    }
  }

  @override
  void dispose() {
    // Clean up the controllers when the widget is removed from widget tree
    _userController.dispose();
    _passController.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Color.fromARGB(255, 214, 214, 214),
      appBar: AppBar(
        title: Text(title),
      ),
      body: SafeArea(
        child: Center(
            child:
                Column(mainAxisAlignment: MainAxisAlignment.center, children: [
          SizedBox(height: 35),

          Text(
            'We\'re under construction. If you\'re an admin or developer, please login below:',
            style: TextStyle(
              fontWeight: FontWeight.w300,
              fontSize: 30,
            ),
          ),
          SizedBox(height: 20),

          // Login: Username
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 100.0),
            child: Container(
                height: 30,
                width: 250,
                decoration: BoxDecoration(
                  color: Colors.white,
                  border: Border.all(color: Colors.black),
                  borderRadius: BorderRadius.circular(5),
                ),
                child: Padding(
                    padding: const EdgeInsets.only(left: 15.0),
                    child: TextField(
                      controller: _userController,
                      decoration: InputDecoration(
                        border: InputBorder.none,
                        hintText: 'Username',
                      ),
                    ))),
          ),
          // End Login: Username

          SizedBox(height: 10),

          // Login: Password
          Padding(
              padding: const EdgeInsets.symmetric(horizontal: 100.0),
              child: Container(
                  height: 30,
                  width: 250,
                  decoration: BoxDecoration(
                    color: Colors.white,
                    border: Border.all(color: Colors.black),
                    borderRadius: BorderRadius.circular(5),
                  ),
                  child: Padding(
                      padding: EdgeInsets.only(left: 15.0),
                      child: TextField(
                          controller: _passController,
                          decoration: InputDecoration(
                            border: InputBorder.none,
                            hintText: 'Password',
                          ),
                          obscureText: true)))),
          // End Login: Password

          SizedBox(height: 10),

          // Sign in button
          Padding(
              padding: const EdgeInsets.symmetric(horizontal: 100.0),
              child: Container(
                  height: 30,
                  width: 125,
                  decoration: BoxDecoration(
                    color: Colors.lightBlue,
                    border: Border.all(color: Colors.black),
                    borderRadius: BorderRadius.circular(5),
                  ),
                  child: Padding(
                      padding: EdgeInsets.only(left: 7.5),
                      child: TextButton(
                          onPressed: () {
                            signIn(context);
                          },
                          child: const Text('Sign in',
                              style: TextStyle(
                                  color: Colors.white,
                                  fontWeight: FontWeight.bold)))))),

          SizedBox(height: 30),

          // TODO: Print if there's an error in the login
        ])),
      ),
    );
  }
}
