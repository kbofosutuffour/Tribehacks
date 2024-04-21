// test code for Grove - Sound Sensor
// loovee @ 2016-8-30

const int pinAdc = A0;

int sound_sensor = A2; //assign to pin A2
 
void setup() 
{
  Serial.begin(9600); //begin Serial Communication

  // initialize digital pin2  as an output.
  pinMode(2, OUTPUT);
}
 
void loop()
{


  //When button pressed on phone, power on Arduino

  digitalWrite(2, HIGH);   // turn the LED on (HIGH is the voltage level)

  int soundValue = 0; //create variable to store many different readings
  for (int i = 0; i < 32; i++) //create a for loop to read 
  { soundValue += analogRead(sound_sensor);  } //read the sound sensor
 
  soundValue >>= 5; //bitshift operation 
  Serial.println(soundValue); //print the value of sound sensor
 
 
//if a value higher than 500 is registered, we will print the following
//this is done so that we can clearly see if the threshold is met
  if (soundValue > 500) { 
    Serial.println("         ||        ");
    Serial.println("       ||||||      ");
    Serial.println("     |||||||||     ");
    Serial.println("   |||||||||||||   ");
    Serial.println(" ||||||||||||||||| ");
    Serial.println("   |||||||||||||   ");
    Serial.println("     |||||||||     ");
    Serial.println("       ||||||      ");
    Serial.println("         ||        ");
  }
  delay(50); //a shorter delay between readings
}
