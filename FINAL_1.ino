
#include <Servo.h>

Servo myservo1;
Servo myservo2;
Servo myservo3;


int pos = 45;
int humanDetected = 0;
int high = 25;
int low = 80;


const int ain1Pin = 3;
const int ain2Pin = 4;
const int pwmAPin = 5;

const int bin1Pin = 8;
const int bin2Pin = 7;
const int pwmBPin = 6;


void setup() {
  myservo1.attach(8);
  myservo2.attach(9);
  myservo3.attach(10);

  pinMode(ain1Pin, OUTPUT);
  pinMode(ain2Pin, OUTPUT);
  pinMode(pwmAPin, OUTPUT);

  Serial.begin(9600);
  while (Serial.available() <= 0) {
    digitalWrite(LED_BUILTIN, HIGH);
    Serial.println("0,0");
    delay(200);
    digitalWrite(LED_BUILTIN, LOW);
    delay(50);
  }
}

void loop() {
  while (Serial.available()) {
    humanDetected = Serial.parseInt();
    if (humanDetected && Serial.read() == '\n') {
      myservo1.write(45);
      myservo2.write(45);
      myservo3.write(low);
      delay(1000);
      myservo3.write(high);
      analogWrite(pwmAPin, 255);
      digitalWrite(ain1Pin, HIGH);
      digitalWrite(ain2Pin, LOW);
      delay(2000);
      analogWrite(pwmAPin, 0);
      myservo3.write(low);
      delay(2000);
    }
    Serial.println(pos);
  }
}
