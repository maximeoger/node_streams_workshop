# Streams Workshop

This project aims to simplify understanding of streams in node JS by providing explanations and concrete examples about the streams behaviors in nodeJS

## What is a stream ?

from [nodejs official documentation](https://nodejs.org/api/stream.html#stream) : A stream is an abstract interface to work with streaming data in node js. 

Basically, a streaming data is a kind of data that are splitted into chunks and treated one by one. This mecanism is preffered to avoid speding too much RAM on treating a file. For example : when we copy/paste a 16mb file from a location to another using the `fs module` with nodeJS, those 16mb will be temporarily stored inside the RAM. which can be problematic because this will occupy this memory space during the processus. 

With stream, we lower the memory usage of such process by splitting the data into chunks that will be treated separately.