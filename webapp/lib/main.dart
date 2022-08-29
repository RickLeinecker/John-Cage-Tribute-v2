// ignore_for_file: prefer_const_constructors

import 'package:flutter/material.dart';
import 'package:drift/drift.dart' as drift;
import 'package:crypt/crypt.dart';
import 'package:webapp/HomePage.dart';

void main() async {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Demo',
      theme: ThemeData(
        // This is the theme of your application.
        //
        // Try running your application with "flutter run". You'll see the
        // application has a blue toolbar. Then, without quitting the app, try
        // changing the primarySwatch below to Colors.green and then invoke
        // "hot reload" (press "r" in the console where you ran "flutter run",
        // or simply save your changes to "hot reload" in a Flutter IDE).
        // Notice that the counter didn't reset back to zero; the application
        // is not restarted.
        primarySwatch: Colors.blueGrey,
      ),
      home: const MyHomePage(title: 'Flutter Demo'),
    );
  }
}

// These two variables hold the username and password, respectively
final _userController = TextEditingController();
final _passController = TextEditingController();
final _errController = TextEditingController();

void signIn(BuildContext context) {
  // Admin login stored here ONLY UNTIL DATABASE IS FULLY FUNCTIONAL
  const _adminUser = "JCTDev";
  final passhash =
      Crypt.sha256("JohnCage2022", rounds: 1000, salt: "chanceoperations");

  final h = Crypt(passhash.toString());

  if (_adminUser == _userController.text.trim() &&
      h.match(_passController.text.trim())) {
    Navigator.push(context, MaterialPageRoute(builder: (context) {
      return const HomePage(title: 'HomePage');
    }));
  } else
    print('ERR: Incorrect username or password');
}

@override
void dispose() {
  // Clean up the controllers when the widget is removed from widget tree
  _userController.dispose();
  _passController.dispose();
}

class MyHomePage extends StatefulWidget {
  const MyHomePage({Key? key, required this.title}) : super(key: key);

  // This widget is the home page of your application. It is stateful, meaning
  // that it has a State object (defined below) that contains fields that affect
  // how it looks.

  // This class is the configuration for the state. It holds the values (in this
  // case the title) provided by the parent (in this case the App widget) and
  // used by the build method of the State. Fields in a Widget subclass are
  // always marked "final".

  final String title;

  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  int _counter = 0;

  void _incrementCounter() {
    setState(() {
      // This call to setState tells the Flutter framework that something has
      // changed in this State, which causes it to rerun the build method below
      // so that the display can reflect the updated values. If we changed
      // _counter without calling setState(), then the build method would not be
      // called again, and so nothing would appear to happen.
      _counter++;
    });
  }

  @override
  Widget build(BuildContext context) {
    // This method is rerun every time setState is called, for instance as done
    // by the _incrementCounter method above.
    //
    // The Flutter framework has been optimized to make rerunning build methods
    // fast, so that you can just rebuild anything that needs updating rather
    // than having to individually change instances of widgets.
    return Scaffold(
      backgroundColor: Color.fromARGB(255, 214, 214, 214),
      appBar: AppBar(
        title: Text('Admin Login'),
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
