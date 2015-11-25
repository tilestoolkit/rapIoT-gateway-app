package no.ntnu.tiles.client;

/**
 * Enables an application to be notified when asynchronous
 * events related to the Tiles client occur.
 * @see TilesClient
 */
public interface TilesCallback {
	
	/**
	 * This method is called when the client is successfully connected to the server.
	 */
	public void connected();
	
	/**
	 * This method is called when a message arrives from the server.
	 * <p>
	 * {@link String#String(byte[])} can be used to get a {@code String} representation of {@code messageBytes}.
	 * @param tileId The ID of the Tile this message originated from.
	 * @param messageBytes The payload bytes of the message.
	 */
	public void messageArrived(String tileId, byte[] messageBytes);
	
	/**
	 * This method is called when a Tile is registered (connected)
	 * @param tileId The ID of the registered Tile
	 */
	public void tileRegistered(String tileId);
	
	/**
	 * This method is called when a Tile is unregistered (disconnected)
	 * @param tileId The ID of the unregistered Tile
	 */
	public void tileUnregistered(String tileId);

}
