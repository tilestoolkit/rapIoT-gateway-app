package no.ntnu.tiles.client;
import java.util.Random;

import org.eclipse.paho.client.mqttv3.IMqttActionListener;
import org.eclipse.paho.client.mqttv3.IMqttDeliveryToken;
import org.eclipse.paho.client.mqttv3.IMqttToken;
import org.eclipse.paho.client.mqttv3.MqttAsyncClient;
import org.eclipse.paho.client.mqttv3.MqttCallback;
import org.eclipse.paho.client.mqttv3.MqttConnectOptions;
import org.eclipse.paho.client.mqttv3.MqttException;
import org.eclipse.paho.client.mqttv3.MqttMessage;
import org.eclipse.paho.client.mqttv3.MqttPersistenceException;

/**
 * A client for event-driven (asynchronous) communication with the Tiles server
 */
public class TilesClient {

	private String host;

	private MqttAsyncClient mqttClient;
	private MqttCallbackHandler mqttCallbackHandler;

	private String username;
	private TilesCallback tilesCallback;

	/**
	 * @param tilesCallback A callback listener to use for asynchronous events.
	 * @param username Your username
	 * @param host Host to connect to. Can include port param by adding :<port> to string
	 * @see TilesCallback
	 */
	public TilesClient(TilesCallback tilesCallback, String username,String host){
		this.tilesCallback = tilesCallback;
		this.username = username;
		this.mqttCallbackHandler = new MqttCallbackHandler();
		this.host=host;
	}

	/**
	 * Connects to the server.
	 * {@link TilesCallback#connected()} is called when the client is successfully connected to the server.
	 */
	public void connect(){
		try {
			mqttClient = new MqttAsyncClient(host, "JavaClient_"+new Random().nextInt(99999));
	    	mqttClient.setCallback(mqttCallbackHandler);
	    	mqttClient.connect(null, mqttCallbackHandler);
		} catch (MqttException e) {
			e.printStackTrace();
		}
	}

	/**
	 * Sends a message to all clients listening for messages for the Tile with the provided ID
	 * @param tileId The ID of the Tile this message is intended for
	 * @param message A {@link String} representation of the message
	 */
	public void send(String tileId, String message){
		send(tileId, message.getBytes());
	}

	/**
	 * Sends a message to all clients listening for messages for the Tile with the provided ID
	 * @param tileId The ID of the Tile this message is intended for
	 * @param bytes The bytes to be sent
	 */
	public void send(String tileId, byte[] bytes){
		try {
			mqttClient.publish("tiles/cmd/"+this.username+"/"+tileId, new MqttMessage(bytes));
		} catch (MqttPersistenceException e) {
			e.printStackTrace();
		} catch (MqttException e) {
			e.printStackTrace();
		}
	}

	private class MqttCallbackHandler implements MqttCallback, IMqttActionListener {
		public void messageArrived(String topic, MqttMessage message) throws Exception {
			String[] splitTopic = topic.split("/");
			String deviceId = splitTopic[3];
			if (splitTopic.length > 4 && splitTopic[4].equals("active")){
				if (new String(message.getPayload()).equals("true")){
					tilesCallback.tileRegistered(deviceId);
				} else {
					tilesCallback.tileUnregistered(deviceId);
				}
			} else {
				tilesCallback.messageArrived(deviceId, message.getPayload());
			}
		}

		public void onSuccess(IMqttToken asyncActionToken) {
	    	try {
				mqttClient.subscribe(new String[]{"tiles/evt/" + username + "/+", "tiles/evt/" + username + "/+/active"}, new int[] {0, 0});
				tilesCallback.connected();
			} catch (MqttException e) {
				e.printStackTrace();
			}
		}

		public void connectionLost(Throwable cause) { }

		public void deliveryComplete(IMqttDeliveryToken token) { }

		public void onFailure(IMqttToken asyncActionToken, Throwable exception) { }
	}

}
