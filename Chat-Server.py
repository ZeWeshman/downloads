from socket import socket, AF_INET, SOCK_STREAM from collections import defaultdict

Stockage des messages et des noms d'affichage

pending_messages = defaultdict(list) display_names = {} enhanced_clients = set()

Paramètres du serveur

HOST = "" PORT = 13450

Lien de téléchargement du client amélioré

CLIENT_DOWNLOAD_LINK = "https://ZeWeshman.github.io/downloads/client.py"

Messages réutilisables

MSG_CLIENT_LINK = f"Téléchargez le client ici : {CLIENT_DOWNLOAD_LINK}\n" MSG_INVALID_SYNTAX = "Syntaxe invalide. Utilisez 'help commandes' pour voir les commandes disponibles.\n"

Fonctions d'envoi

def sendMessage(connection, a="", b="", c=""): connection.send(f"{a}{b}{c}\n".encode())

print(f"Serveur en écoute sur le port {PORT}")

s = socket(AF_INET, SOCK_STREAM) s.bind((HOST, PORT)) s.listen(5)

running = True

while running: conn, addr = s.accept() ip = addr[0] req = conn.recv(2048).decode().strip()

if not req:
    conn.close()
    continue

print(f"Reçu de {ip} : {req}")

if req.lower() == "fin":
    print(f"{ip} sent 'fin' — shutting down.")
    sendMessage(conn, "ok")
    running = False

elif req.lower().startswith("msg "):
    parts = req.split(" ", 2)
    if len(parts) < 3:
        sendMessage(conn, MSG_INVALID_SYNTAX)
    else:
        target, msg = parts[1], parts[2]
        if target.startswith("id="):
            try:
                last_octet = int(target[3:])
                dest_ip = f"192.168.1.{last_octet}"
            except:
                sendMessage(conn, MSG_INVALID_SYNTAX)
                conn.close()
                continue
        else:
            dest_ip = target

        pending_messages[dest_ip].append((msg, ip))
        sendMessage(conn, "Message envoyé.")

elif req.lower().startswith("brc "):
    msg = req[4:].strip()
    for target_ip in pending_messages:
        if target_ip != ip:
            pending_messages[target_ip].append((msg, ip))
    sendMessage(conn, "Message envoyé à tous.")

elif req.lower() == "cmsg":
    messages = pending_messages[ip]
    if messages:
        formatted = []
        for msg, sender in messages:
            name = display_names.get(sender, sender)
            if name == sender:
                formatted.append(f"{name} : {msg}")
            else:
                suffix = "+" if sender in enhanced_clients else ""
                formatted.append(f"{name}{suffix} ({sender.split('.')[-1]}) : {msg}")
        sendMessage(conn, "\n".join(formatted))
        pending_messages[ip].clear()
    else:
        sendMessage(conn, "Aucun message en attente.")

elif req.lower().startswith("dname "):
    name = req[6:].strip()
    if name.endswith("+"):
        sendMessage(conn, "Le nom ne peut pas se terminer par '+'")
    else:
        display_names[ip] = name
        sendMessage(conn, f"Nom défini sur {name}")

elif req.lower().startswith("help"):
    topic = req[4:].strip().lower()
    if topic in ["", "commandes"]:
        help_text = (
            "Commandes disponibles :\n"
            "msg <ip> <message> - Envoyer un message à une IP\n"
            "msg id=<id> <message> - Envoyer un message à un ID\n"
            "brc <message> - Envoyer un message à tout le monde\n"
            "cmsg - Consulter vos messages\n"
            "dname <nom> - Définir un nom d'affichage\n"
            "help [IP|ID|nom|commandes] - Afficher l'aide\n"
            "info [IP|ID|nom] - Afficher votre IP, ID ou nom\n"
            "getclient - Obtenir des informations sur le client amélioré"
        )
        sendMessage(conn, help_text)

    elif topic == "ip":
        sendMessage(conn, "Votre IP sert d'identifiant unique pour recevoir les messages.")
    elif topic == "id":
        sendMessage(conn, "L'ID correspond au dernier chiffre de votre adresse IP (192.168.1.X).")
    elif topic == "nom":
        sendMessage(conn, "Le nom d'affichage permet d'identifier l'expéditeur plus facilement.")
    else:
        sendMessage(conn, MSG_INVALID_SYNTAX)

elif req.lower().startswith("info"):
    topic = req[4:].strip().lower()
    if topic == "ip":
        sendMessage(conn, f"Votre IP est {ip}")
    elif topic == "id":
        sendMessage(conn, f"Votre ID est {ip.split('.')[-1]}")
    elif topic == "nom":
        sendMessage(conn, f"Nom d'affichage : {display_names.get(ip, 'non défini')}")
    else:
        sendMessage(conn, MSG_INVALID_SYNTAX)

elif req.lower() == "getclient":
    sendMessage(conn, f"{MSG_CLIENT_LINK}\nCe client propose : menus interactifs, aide intégrée, noms d'affichage, envoi par ID ou broadcast, et plus encore. Il est plus simple à utiliser et améliore votre expérience.")

elif req.lower() == "@enhanced":
    enhanced_clients.add(ip)
    # No response sent

else:
    sendMessage(conn, MSG_INVALID_SYNTAX)

conn.close()

s.close()

