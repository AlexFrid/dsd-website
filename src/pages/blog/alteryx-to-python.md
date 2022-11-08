---
layout: "../../layouts/BlogPost.astro"
title: "Converting an Alteryx tool into a Python function"
description: "A learning challenge"
pubDate: "Feb 01, 2020"
heroImage: "../images/alteryx-to-python.png"
---

A while ago I was doing some fuzzy matching and tried out a challenge to convert the typical fuzzy matching process
in Alteryx into a pythonic way of doing it.

While I didn't end up completing it, 
I was quite happy that I was able to complete one of the tools, 
the Alteryx make group tool.

![Make Group](../../images/make-groups/makegroup.jpg)

While I had used it several times in Alteryx, I didn't really know how it worked.
Well.. I knew the make group tool makes groups! Obviously :)

But how does it actually do it?

In situations like this I find the best place to start is reading the 
documentation, which in Alteryx's case its best at look at the tool examples
found here:

![Make Group example](../../images/make-groups/make-groups-example-menu.PNG)


After opening the example, we're greeted with this very helpful explanation:

![Make Group explanation](../../images/make-groups/make-groups-explanation.PNG)

From looking closely at this we can deduce that the make group tool
is actually doing a few things:

1. Looking at each row and seeing all the possible connections
(Luke is connected to Obi, Jabba is connected to Boba and so forth).

2. Based on those connections it then makes a network graph where the
nodes are a unique list of each person and the edges are the
relationships between each person.

3. Then establishing that there are two groups.

4. Finally, a group name is selected and a dataframe is outputted with two columns.
A column for the group name and a column for the person.

Having understood the logic of what the tool is doing, its time to convert that
logic into Python code.

Hopefully, the code is commented enough so you can understand what its doing,
otherwise let me know ;)

```python
"""Replicates the make group tool in Alteryx"""

# Import necessary modules
import networkx as nx
import pandas as pd
from itertools import repeat
from networkx.algorithms import community


def makegroups(df):
    """
    Replicates the functionality of the make group tool in Alteryx
    Expects a pandas dataframe ("df") with two columns.
    """
    try:
        # Renames df columns
        df.columns = ['a', 'b']

        # Converting the df to a list for network edges
        edgesList = df.values.tolist()

        # Converting the df to a dictionary for network nodes
        nodeDict = df.to_dict('list')

        # Creating an empty graph
        G = nx.Graph()

        # Adding nodes from both lists in the dictionary
        # Effectively a merge of the two lists
        G.add_nodes_from(nodeDict['a'])
        G.add_nodes_from(nodeDict['b'])

        # Adding the edges from the edges list
        G.add_edges_from(edgesList)

        # Generates groups
        # TODO check that size of smallest clique, here 2 is dynamic
        comm = list(community.k_clique_communities(G, 2))

        # Splits the communities into two lists
        comm1 = list(comm[0])
        comm2 = list(comm[1])

        # Generates list of the group name
        # Replicates the group name to match community list length
        group1 = list(repeat(comm1[0], len(comm1)))
        group2 = list(repeat(comm2[0], len(comm2)))

        # combines each group name and community list into a dataframe
        dfGroup1 = pd.DataFrame(list(zip(group1, comm1)), columns=['Group', 'key'])
        dfGroup2 = pd.DataFrame(list(zip(group2, comm2)), columns=['Group', 'key'])

        # Combines both dataframes into the final dataframe
        df = dfGroup1.append(dfGroup2, ignore_index=True)
        print("Success: Groups created")
        return df
    except Exception as e:
        print("Error: Function - makegroups:", e)
```

Now we can call the function and get the groups

```python
makegroups(df)
```

![Make Group Python](../../images/make-groups/mg-python.png)

You can find the Python file and a notebook file at:
[https://github.com/AlexFrid/MakeGroup](https://github.com/AlexFrid/MakeGroup)
