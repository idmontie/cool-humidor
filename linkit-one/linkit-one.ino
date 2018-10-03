#include "dht.h"
#include <LTask.h>
#include <LWiFi.h>
#include <LWiFiClient.h>
#include <LBattery.h>
#include "env.h"

#define DHTPIN 2
#define DHTTYPE DHT11

LDHT dht(DHTPIN, DHTTYPE);

float temp = 0.0;
float humidity = 0.0;
bool wasDry = true;
bool wasWatered = false;

/**
 * When the LinkIt One boots up, set up the pins and WIFI
 */
void setup()
{
    LTask.begin();
    LWiFi.begin();
    pinMode(13, OUTPUT);

    Serial.begin(9600);
    dht.begin();

    Serial.println("Connecting to WIFI");
    while (0 == LWiFi.connect(WIFI_AP, LWiFiLoginInfo(WIFI_AUTH, WIFI_PASSWORD)))
    {
        delay(1000);
    }

    Serial.println("Connected. All systems are GO");
}

void blinkLight()
{
    digitalWrite(13, HIGH);
    delay(100);
    digitalWrite(13, LOW);
}

void push(float temp, float humidity)
{
    LWiFiClient c;
    while (!c.connect(HOST, PORT))
    {
        Serial.println("Retrying to connect...");
        delay(100);
    }

    String data = "{\"humidity\":\"" + String(humidity) + "\", \"temp\": \"" + String(temp) + "\" }";
    String thisLength = String(data.length());

    // Build HTTP POST request
    c.print("POST /thermo/actions/push");
    c.println(" HTTP/1.1");
    c.print("Host: ");
    c.println(HOST);
    c.println("Content-Type: application/json");
    c.print("Content-Length: ");
    c.println(thisLength);
    c.print("\n" + data);

    // read server response
    while (c)
    {
        int v = c.read();
        if (v != -1)
        {
            Serial.print((char)v);
        }
    }
    c.stop();

}

void loop()
{
    // TODO check battery level. Send push if 0%.
    /// Keep in mind that the Linkit will only return 4 possible values for the battery level: 100%, 66%, 33% or 0%.

    // Reading temperature or humidity takes about 250 milliseconds!
    // Sensor readings may also be up to 2 seconds 'old' (its a very slow sensor)
    if (dht.read())
    {
        Serial.println("*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*");
        blinkLight();
        temp = dht.readTemperature();
        humidity = dht.readHumidity();
        push(temp, humidity);

        Serial.print("Temperature Celsius = ");
        Serial.print(temp);
        Serial.println("C");

        Serial.print("Humidity = ");
        Serial.print(humidity);
        Serial.println("%");
    }

    delay(2000);
}
