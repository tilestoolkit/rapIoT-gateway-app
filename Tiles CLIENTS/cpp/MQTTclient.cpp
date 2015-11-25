#include "MQTTclient.h"
#include "TileActiveListener.h"

void MQTTClient::connectClient()
{
	if (host!="" && port!=0)
	{
		mosqpp::lib_init();
		connect(host.c_str(), port, keepalive);
		connected = true;
	}
}


MQTTClient::MQTTClient()
{
	username = "";
	host = "";
	port = 0;
	keepalive = 0;
	connected = false;
}

MQTTClient::MQTTClient(const std::string& username, const std::string& host, int port, int keepalive)
{
	this->username = username;
	this->host = host;
	this->port = port;
	this->keepalive = keepalive;
	connected = false;

	
	
	connectClient();
}


MQTTClient::~MQTTClient()
{
	disconnect();
	mosqpp::lib_cleanup();
}

void MQTTClient::on_connect(int rc)
{
	if (rc == 0)
		subscribe(0, "testuser/#");
}

void MQTTClient::on_message(const struct mosquitto_message *msg)
{
	std::string s(static_cast<const char*>(msg->payload), msg->payloadlen);

	Listener::const_iterator search = listeners.find(s);//look for specific routes
	if (search != listeners.end())
		search->second->listener(msg->topic,s);
	else//if not found..
	{
		//look for pattern routes
		for (auto it = patternListeners.begin(); it != patternListeners.end(); ++it)
		{
			bool result = false;
			mosqpp::topic_matches_sub(it->first.c_str(), msg->topic, &result);
			if (result)
			{
				it->second->listener(msg->topic, s);
				break;
			}
		}
	}
}

void MQTTClient::on_subscribe(int mid, int qos, const int *granted_qos)
{
}

void MQTTClient::subscribeTo(const std::string& topic)
{
	subscribe(0, topic.c_str());
}

void MQTTClient::publishTo(const std::string& topic,const std::string& data)
{
	publish(0, topic.c_str(), data.length(), data.c_str());
}

void MQTTClient::run()
{
	if (!isConnected())
		connectClient();
	int rc;

	while (true)
	{
		rc = this->loop();
		if (rc)
			this->reconnect();
	}
}

void MQTTClient::addListener(const std::string& topic, TileListener* listen)
{
	listeners.insert(std::make_pair(topic, listen));
}

void MQTTClient::addPatternListener(const std::string& pattern, TileListener*listen)
{
	this->patternListeners.insert(std::pair<std::string, TileListener*>(pattern, listen));
}

const std::string& MQTTClient::getUsername() const
{
	return username;
}

void MQTTClient::setUsername(const std::string& username)
{
	this->username = username;
}

const std::string& MQTTClient::getHost() const
{
	return host;
}

void MQTTClient::setHost(const std::string& host)
{
	this->host = host;
}

int MQTTClient::getPort() const
{
	return port;
}

void MQTTClient::setPort(int port)
{
	this->port = port;
}

int MQTTClient::getKeepAlive() const
{
	return keepalive;
}

void MQTTClient::setKeepAlive(int keepalive)
{
	this->keepalive = keepalive;
}

bool MQTTClient::isConnected()
{
	return connected;
}

