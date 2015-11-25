#ifndef MQTTCLIENT_H
#define MQTTCLIENT_H

#include <mosquittopp.h>
#include <string>
#include "TileListener.h"
#include <unordered_map>
#include <regex>
#include <map>

typedef std::unordered_map<std::string, TileListener*> Listener;
class MQTTClient :public mosqpp::mosquittopp
{
private:
	//Listener listeners;
	Listener listeners;

	std::map<std::string,TileListener*> patternListeners; 

	std::string host;
	std::string username;

	int port;
	int keepalive;

	void connectClient();

	bool connected; 

public:
	MQTTClient();
	MQTTClient(const std::string&, const std::string&, int=1883, int = 60);//username,host,port,keepalive
	~MQTTClient();

	void on_connect(int);
	void on_message(const struct mosquitto_message*);
	void on_subscribe(int, int, const int*);

	void subscribeTo(const std::string &);//subscribe to topic
	void publishTo(const std::string &, const std::string &);//topic,data

	void run();

	void addListener(const std::string&, TileListener*);
	void addPatternListener(const std::string&, TileListener*);

	//GETTERS & SETTERS
	const std::string & getUsername() const;
	void setUsername(const std::string&);

	const std::string & getHost() const;
	void setHost(const std::string&);

	int getPort() const;
	void setPort(int);

	int getKeepAlive() const;
	void setKeepAlive(int);

	bool isConnected();


};


#endif