
# Nanopi Monitoring Agent

## What's up?  

A nodejs agent for read hardware info about aarch64 NanoPI boards (NEO2 and NEO-Plus-2 100% tested).  
it reads:
- mac_address
- hostname
- local ip
- vpn ip
- uptime
- load
- temperature

It works in combination with the [nanopi-mon-server](https://github.com/Leen15/nanopi-mon-server).

This repo has two dockerfiles:    
`Dockerfile`: Default dockerfile for run the agent on any x64 architecture. Keep attention, no temperature support.
`Dockerfile-aarch64`: Dockerfile for build and run the agent on a aaarch64 board, it's possible to build this image on any x64 architecture.

## Environment Variables  

You have to set these environment variables:  
`SERVER_URL`: nanopin-mon-server URL, in the format http://nanopi.mon-server.url:8080   
`AGENT_INTERVAL`: cron setting for read data and send to the server. The format is `*/10 * * * * *` (in this case it runs every 10 seconds)   
`ETH_INTERFACE`: ethernet interface name for check the mac address. Default value set to `eth0`. You have to pass `--network=host` for detect the right mac address.   
`VPN_INTERFACE`: ethernet interface name for check ip of a VPN. Default value set to `eth0` for fallback. You have to pass `--network=host` for detect the right mac address.
