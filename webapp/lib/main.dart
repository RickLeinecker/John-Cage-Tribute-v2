// ignore_for_file: prefer_const_constructors

import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import 'FireAPI.dart';

// Firebase imports
import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'firebase_options.dart';

// Database
import 'DB.dart';

// Pages
import 'HomePage.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Initializing Firebase
  await Firebase.initializeApp(
    options: DefaultFirebaseOptions.currentPlatform,
  );

  final database = MyDatabase();

  //final allRecordings = await database.select(database.recordings).get();

  // print(
  //     'Here\'s my data: ${allRecordings.elementAt(0).id}, ${allRecordings.elementAt(0).name}, ${allRecordings.elementAt(0).location}');

  // print(
  //     'Here\'s my data: ${allRecordings.elementAt(1).id}, ${allRecordings.elementAt(1).name}, ${allRecordings.elementAt(1).location}');

  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MultiProvider(
        providers: [
          Provider<AuthenticationService>(
            create: (_) => AuthenticationService(FirebaseAuth.instance),
          ),
          StreamProvider(
            create: (context) =>
                context.read<AuthenticationService>().authStateChanges,
            initialData: null,
          ),
        ],
        child: MaterialApp(
          title: 'John Cage Tribute',
          theme: ThemeData(
            primarySwatch: Colors.blue,
            visualDensity: VisualDensity.adaptivePlatformDensity,
          ),
          home: AuthenticationWrapper(),
        ));
  }
}

// These two variables hold the username and password, respectively
final _userController = TextEditingController();
final _passController = TextEditingController();
final _errController = TextEditingController();

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

          Container(
            height: 150,
            width: 400,
            decoration: BoxDecoration(
                color: Colors.white,
                border: Border.all(color: Colors.black),
                borderRadius: BorderRadius.circular(5),
                boxShadow: [
                  BoxShadow(
                    color: Colors.grey,
                    blurRadius: 10,
                    spreadRadius: 3,
                    offset: const Offset(3, 3),
                  ),
                ]),
            child: Center(
              child: Padding(
                padding: EdgeInsets.symmetric(horizontal: 5.0),
                child: Text(
                  'We\'re under construction. If you\'re an admin or developer, please login below:',
                  style: TextStyle(
                    fontWeight: FontWeight.w300,
                    fontSize: 30,
                  ),
                  textAlign: TextAlign.center,
                ),
              ),
            ),
          ),

          SizedBox(height: 50),

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
                            context.read<AuthenticationService>().signIn(
                                  email: _userController.text.trim(),
                                  password: _passController.text.trim(),
                                );
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

// Authentication wrapper, handles user authentication
// through Firebase's Authentication API
class AuthenticationWrapper extends StatelessWidget {
  const AuthenticationWrapper({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final firebaseUser = context.watch<User?>();

    if (firebaseUser != null) {
      return HomePage(title: 'John Cage Tribute');
    }

    return MyHomePage(title: 'Sign In');
  }
}
