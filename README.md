# Cool Humidor

The Cool Humidor project is meant to be an IoT device to help track the humidity of plants.
This project uses the following to let you know when to water plants:

* LinkIt One Board with WiFi module
* Node Server
* PushBullet for notifications

## Constraints

1. Use a LinkIt One board I had.
2. Track humidity for plants
3. Let me know when to water them with a message on my phone
    1. The LinkIt One could use GSM to send text messages, but I did not have a SIM card that could
   send text messages. That leaves us with WiFi.
4. No recurring charges

## Hidden Constaints

1. The LinkIt One WiFi only has support for HTTP requests, so calling PushBullet's API directly
   was out since their API must use HTTPS.

## Details

* See the [linkit-one README](./linkit-one/README.md) for details
* See the [server README](./server/README.md) for details
