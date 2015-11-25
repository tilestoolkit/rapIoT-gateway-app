package no.ntnu.tiles.client.examples;

import no.ntnu.tiles.client.TilesCallback;
import no.ntnu.tiles.client.TilesClient;

public class HelloWorldExample implements TilesCallback {
	
	private TilesClient client;
	
	public static void main(String[] args) {
		HelloWorldExample helloWorld = new HelloWorldExample();
		helloWorld.connect();
	}
	
	public void connect(){
		client = new TilesClient(this, "TestUser");
		client.connect();
	}

	public void connected() {
		System.out.println("Connected!");
		client.send("AB:CD:12:34:56", "Hello World!");
	}

	public void messageArrived(String deviceId, byte[] message) {
		System.out.println("Message arrived for "+deviceId+": "+new String(message));
	}

	public void tileRegistered(String deviceId) {
		System.out.println("Device registered: "+deviceId);
	}

	public void tileUnregistered(String deviceId) {
		System.out.println("Device unregistered: "+deviceId);
	}

}
