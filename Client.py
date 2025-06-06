from socket import socket, AF_INET, SOCK_STREAM

# IP du serveur de ZeWeshman
SERVEUR = "192.168.1.64"
PORT = 13450

def envoyer_commande(commande):
    try:
        s = socket(AF_INET, SOCK_STREAM)
        s.connect((SERVEUR, PORT))
        s.send(commande.encode())
        reponse = s.recv(2048).decode()
        s.close()
        return reponse
    except Exception as e:
        return f"Erreur de connexion : {e}"

def menu():
    while True:
        print("\n--- Menu ---")
        print("1. Envoyer un message à une IP")
        print("2. Envoyer un message à un ID")
        print("3. Envoyer un message à tout le monde")
        print("4. Consulter mes messages")
        print("5. Définir mon nom d'affichage")
        print("6. Aide")
        print("7. Quitter")
        choix = input("Choix (1-7) : ").strip()

        if choix == "1":
            ip = input("IP de destination (ex: 192.168.1.42) : ").strip()
            msg = input("Message : ").strip()
            commande = f"msg {ip} {msg}"
            print(envoyer_commande(commande))

        elif choix == "2":
            identifiant = input("ID de destination (dernier chiffre IP) : ").strip()
            msg = input("Message : ").strip()
            commande = f"msg id={identifiant} {msg}"
            print(envoyer_commande(commande))

        elif choix == "3":
            msg = input("Message à envoyer à tout le monde : ").strip()
            commande = f"brc {msg}"
            print(envoyer_commande(commande))

        elif choix == "4":
            print(envoyer_commande("cmsg"))

        elif choix == "5":
            nom = input("Nom d'affichage : ").strip()
            commande = f"dname {nom}"
            print(envoyer_commande(commande))

        elif choix == "6":
            topic = input("Aide sur (IP, ID, commandes) : ").strip()
            if topic.lower() not in ["ip", "id", "commandes"]:
                topic = "commandes"
            print(envoyer_commande(f"help {topic}"))

        elif choix == "7":
            print("Fermeture du programme.")
            break

        else:
            print("Choix invalide.")

if __name__ == "__main__":
    print("=== Client de messagerie local ===")
    print(f"Connexion au serveur {SERVEUR}:{PORT}")
    envoyer_commande("@enhanced")
    menu()
