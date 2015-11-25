package no.ntnu.tiles.client.examples;

import java.util.HashSet;

import no.ntnu.tiles.client.TilesCallback;
import no.ntnu.tiles.client.TilesClient;
import no.ntnu.tiles.util.JsonMessage;
import no.ntnu.tiles.util.TilesEventMessageBuilder;

public class CrossCommunicationExample implements TilesCallback {
	
	private TilesClient client;
	private HashSet<String> registeredTiles = new HashSet<String>();
	
	public static void main(String[] args) {
		CrossCommunicationExample crossCommunication = new CrossCommunicationExample();
		crossCommunication.connect();
	}
	
	public void connect(){
		client = new TilesClient(this, "TestUser");
		client.connect();
	}

	public void connected() {
		System.out.println("Connected!");
	}
	
	public void messageArrived(String tileId, byte[] messageBytes) {
		System.out.println("Message arrived for " + tileId + ": " + new String(messageBytes));
		JsonMessage json = new JsonMessage(messageBytes);
		if ("button_event".equals(json.getEventType())) {	
			boolean activation = "pressed".equals(json.getEvent());
			String jsonStr = new TilesEventMessageBuilder().setActivation(activation).build();
			for (String registeredTileId : registeredTiles){
				if (registeredTileId.equals(tileId)) continue; // Don't send to self
				client.send(registeredTileId, jsonStr);
			}
		}
	}

	public void tileRegistered(String tilesId) {
		System.out.println("Tile registered: "+tilesId);
		registeredTiles.add(tilesId);
		System.out.println(registeredTiles.toString());
	}

	public void tileUnregistered(String deviceId) {
		System.out.println("Tile unregistered: "+deviceId);
		registeredTiles.remove(deviceId);
		System.out.println(registeredTiles.toString());
	}

}
