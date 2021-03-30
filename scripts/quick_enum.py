import os

#
# Purely for quickly generating contents for 'list.html', nothing more
#

def qe():
    print("Running!")

    path = "./db/simple/"
    files = os.listdir(path)

    print("Found" + str(len(files)))

    for fn in files:
            f = open(os.path.join(path,fn),'r')
            print("<h4>"+fn.split(".")[0].replace("_"," ")+"</h4><div class='code'>" + f.read() + "</div>")
            f.close()
