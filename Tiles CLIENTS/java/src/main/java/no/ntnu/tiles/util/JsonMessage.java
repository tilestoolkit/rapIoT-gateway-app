package no.ntnu.tiles.util;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

/**
 * A class for parsing a received JSON message and extract fields
 */
public class JsonMessage {
	
	private JsonObject jsonObj;
	
	public JsonMessage(byte[] messageBytes){
		this(new String(messageBytes));
	}
	
	public JsonMessage(String message){
		jsonObj = new JsonParser().parse(message).getAsJsonObject();
	}
	
	public String getStringField(String name){
		return jsonObj.has(name) ? jsonObj.get(name).getAsString() : null;
	}
	
	public String getEventType(){
		return getStringField("type");
	}
	
	public String getEvent(){
		return getStringField("event");
	}

}
