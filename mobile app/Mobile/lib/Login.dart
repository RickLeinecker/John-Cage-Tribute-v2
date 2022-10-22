// Packages
import 'package:flutter/material.dart';
import 'package:socket_io_client/socket_io_client.dart';

// Socket to communicate with server
Socket server = io("http://192.168.12.117:8080/",
    new OptionBuilder().setTransports(["websocket"]).build());

// These two variables hold the username and password, respectively
final _emailController = TextEditingController();
final _passController = TextEditingController();

@override
void dispose() {
  // Clean up the controllers when the widget is removed from widget tree
  _emailController.dispose();
  _passController.dispose();
}

void signin() {
  final _email = _emailController.text.trim();
  final _password = _passController.text.trim();

  // Credentials JSON to send to the server
  final _credentials = {"email": _email, "password": _password};

  print(_credentials);

  server.emit("login", _credentials);
}

class LoginPage extends StatefulWidget {
  const LoginPage({Key? key, required this.title}) : super(key: key);

  final String title;

  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  @override
  Widget build(BuildContext context) {
    // This method is rerun every time setState is called, for instance as done
    // by the _incrementCounter method above.

    server.on("connect", (_) => print("Connection successful!"));

    return MaterialApp(
        title: "John Cage Tribute",
        home: Scaffold(
          backgroundColor: const Color.fromARGB(255, 214, 214, 214),
          appBar: AppBar(
            title: const Text('Admin Login'),
          ),
          body: Center(
              child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                const SizedBox(height: 35),

                Container(
                  height: 75,
                  decoration: BoxDecoration(
                      color: Colors.white,
                      border: Border.all(color: Colors.black),
                      borderRadius: BorderRadius.circular(5),
                      boxShadow: const [
                        BoxShadow(
                          color: Colors.grey,
                          blurRadius: 10,
                          spreadRadius: 3,
                          offset: Offset(3, 3),
                        ),
                      ]),
                  child: const FractionallySizedBox(
                    heightFactor: 0.5,
                    widthFactor: 0.67,
                    child: Padding(
                      padding: EdgeInsets.symmetric(horizontal: 5.0),
                      child: Text(
                        'Welcome back! Please login:',
                        style: TextStyle(
                          fontWeight: FontWeight.w300,
                          fontSize: 20,
                        ),
                        textAlign: TextAlign.center,
                      ),
                    ),
                  ),
                ),

                const SizedBox(height: 50),

                // Login: Email
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 70.0),
                  child: Container(
                      height: 60,
                      decoration: BoxDecoration(
                        color: Colors.white,
                        border: Border.all(color: Colors.black),
                        borderRadius: BorderRadius.circular(5),
                      ),
                      child: Padding(
                          padding: const EdgeInsets.only(left: 5.0, right: 5.0),
                          child: TextField(
                            textAlignVertical: TextAlignVertical.center,
                            controller: _emailController,
                            decoration: const InputDecoration(
                              border: InputBorder.none,
                              hintText: 'Email',
                            ),
                          ))),
                ),
                // End Login: Username

                const SizedBox(height: 10),

                // Login: Password
                Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 70.0),
                    child: Container(
                        height: 60,
                        decoration: BoxDecoration(
                          color: Colors.white,
                          border: Border.all(color: Colors.black),
                          borderRadius: BorderRadius.circular(5),
                        ),
                        child: Padding(
                            padding:
                                const EdgeInsets.only(left: 5.0, right: 5.0),
                            child: TextField(
                                controller: _passController,
                                decoration: const InputDecoration(
                                  border: InputBorder.none,
                                  hintText: 'Password',
                                ),
                                obscureText: true)))),
                // End Login: Password

                const SizedBox(height: 50),

                // Sign in button
                Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 100.0),
                    child: Container(
                        height: 60,
                        width: 200,
                        decoration: BoxDecoration(
                          color: Colors.lightBlue,
                          border: Border.all(color: Colors.black),
                          borderRadius: BorderRadius.circular(5),
                        ),
                        child: Padding(
                            padding: const EdgeInsets.only(left: 7.5),
                            child: TextButton(
                                onPressed: () {
                                  signin();
                                },
                                child: const Text('Sign in',
                                    style: TextStyle(
                                        color: Colors.white,
                                        fontWeight: FontWeight.bold)))))),

                const SizedBox(height: 30),

                // TODO: Print if there's an error in the login
              ])),
        ));
  }
}

// Authentication wrapper, handles user authentication
// through Firebase's Authentication API
// class AuthenticationWrapper extends StatelessWidget {
//   const AuthenticationWrapper({Key? key}) : super(key: key);

//   @override
//   Widget build(BuildContext context) {
//     return const LoginPage(title: 'Sign In');
//   }
// }
