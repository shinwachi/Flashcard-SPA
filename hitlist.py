# parse hitlist file

filename = "hitlist3.txt"

infile = open(filename, "r")
#outfile = open("temp.txt", "w")
wordDict = {}
currentWord = None
for row in infile:
    #outfile.write(row)
    if row.startswith("#WORD:"):
        currentWord = row.strip()[len("#WORD:"):]
        wordDict[currentWord] = unicode("", 'utf-8')
        print currentWord
    elif currentWord is not None: 
        wordDict[currentWord] = wordDict[currentWord]+unicode(row, 'utf-8')


#print wordDict.items()


wordList = []
for k, v in wordDict.items():
    wordList.append({"word":k, "def":v})
infile.close()

#outfile.close()
import json
import codecs
output_file = codecs.open("hitlist.json", "w", encoding="utf-8")



#with open("hitlist.json", "wb") as fp:
json.dump(wordList, output_file, indent=4, ensure_ascii=False)


