package no.ntnu.tiles.util;

import java.util.HashMap;
import java.util.Map;

import com.google.gson.Gson;

/**
 * Builder class for creating Tiles event messages (JSON strings).
 */
public class TilesEventMessageBuilder {
	
	private HashMap<String, String> map;
	
	/**
     * Constructs a new builder for a Tiles event message
     */
	public TilesEventMessageBuilder(){
		map = new HashMap<String, String>();
	}
	
	/**
     * Sets the activation attribute to either {@code "on"} or {@code "off"}
     * @param activation {@code true} to turn on the light, {@code false} to turn off
     * @return {@code this} object for method chaining
     */
	public TilesEventMessageBuilder setActivation(boolean activation){
		map.put("activation", activation ? "on" : "off");
		return this;
	}
	
	// Methods for additional attributes can be added here in the
	// future, as the Tiles devices are updated.
	
	/**
     * Combine all of the options that have been set and create a JSON string
     * @return the built Tiles event message, a JSON string
     */
	public String build(){
		return new Gson().toJson(map, Map.class);
	}

}
