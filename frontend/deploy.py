# Deployment Script

import sys
import os
import pathlib

try:
    import paramiko
    import scp
except ImportError:
    print("Trying to install required modules (paramiko, scp)\n")
    os.system("python -m pip install paramiko scp")

import paramiko
import scp


HOST = "capstone.simonliveshere.com"
USER = "ubuntu"

SOURCE_DIRECTORY = "./src"
TARGET_DIRECTORY = "/var/www/capstone"

FILE_TYPES = [".html", ".css"]
ADDITIONAL_FILES = ["./src/js/index.js", "./src/js/index.js.map"]


# Upload progress
def progress(filename, size, sent):
    sys.stdout.write(f"Progress: {float(sent)/float(size)*100:.2f}%\r")


# Recursive folder crawling
def check_folder(file_path, file_list):
    for child in file_path.iterdir():
        if child.is_dir():
            check_folder(child, file_list)
        else:
            if child.suffix in FILE_TYPES:
                file_list.append(child)


# Get confirmation
reply = str(input(f"\nAre you sure you want to deploy to {HOST}? (Y/N)")).lower().strip()
if reply[0] != "y":
    exit()


# Initialise ssh connection
ssh_client = paramiko.SSHClient()
ssh_client.load_system_host_keys()
ssh_client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh_client.connect(HOST, 22, USER)


# Crawl folder and upload files
scp_client = scp.SCPClient(ssh_client.get_transport(), progress=progress)
try:
    # Load the additional files into upload queue
    upload_queue = list(map(lambda x:pathlib.Path(x), ADDITIONAL_FILES))
    
    # Work with pure paths
    SOURCE_DIRECTORY = pathlib.Path(SOURCE_DIRECTORY)
    TARGET_DIRECTORY = pathlib.Path(TARGET_DIRECTORY)

    # Crawl the directory and populate upload_queue with files we need to upload
    check_folder(SOURCE_DIRECTORY, upload_queue)

    for file in upload_queue:
        print(f"Uploading {file}")

        # Generate (posix) server file path and upload
        target_path = TARGET_DIRECTORY / file.relative_to(SOURCE_DIRECTORY)
        try:
            scp_client.put(file, target_path.as_posix())
        except scp.SCPException as e:
            # SCP connection gets dropped if the directory is missing
            if "No such file or directory" in e.args[0]:
                print("Directory missing - creating and trying again")
                # Create the folder, reset the connection, and try again
                ssh_client.exec_command("mkdir " + target_path.parent.as_posix())
                scp_client = scp.SCPClient(ssh_client.get_transport(), progress=progress)
                print(f"Uploading {file}")
                scp_client.put(file, target_path.as_posix())
            else:
                print("Something has gone wrong")
                print(e)
                scp_client.close()
                exit()
finally:
    scp_client.close()
