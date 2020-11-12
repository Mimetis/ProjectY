from ygdra import *
import os

# print(ygdra)

d = ygdraHelpers("ddiidid")


os.environ["AZURE_TENANT_ID"] = "72f988bf-86f1-41af-91ab-2d7cd011db47"
os.environ["AZURE_CLIENT_SECRET"] = "X7-zJtH7p.OXPJWi32uZm~Yw-2VaE-OB22"
os.environ["AZURE_CLIENT_ID"] = "4aba8f97-baf0-4d6c-b1bd-1f15ea871ba3"
os.environ["YGDRA_SCOPE"] = "https://microsoft.onmicrosoft.com/4aba8f97-baf0-4d6c-b1bd-1f15ea871ba3/.default"
os.environ["YGDRA_ENGINE_NAME"] = "engr10czc"
os.environ["YGDRA_HOST"] = "https://localhost:44339"

# token = d.auth()


# engine = d.getEngine()

# print(engine)

print(d.getdf(12))

# engine = d.getEngine()
