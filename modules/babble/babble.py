#!/usr/bin/env python
"""
    babble.py
    ~~~~~~~~~

    Wrapper on markov script by Max Wegner by Stephen Balaban.

    :created: 2015-03-14 00:35:07 -0700
    :copyright: (c) 2015, Lambda Labs, Inc.
    :license: MIT License
"""
import sys
import os
import MarkovChain
import random

raw_data_folder = './data/'
database_folder = './dbs/'
valid_chans = ['cyb', 'diy', 'drg', 'lam', 'layer', 'lit', 'rpg', 'r', 'tech',
               'w', 'zzz']


def forum_to_chain(f):
    if f.lower() not in valid_chans:
        f = random.choice(valid_chans)

    db_path = os.path.join(database_folder, f.lower() + '.db')
    m = MarkovChain.MarkovChain(db_path)
    if os.path.exists(db_path):
        return m
    else:
        if not os.path.exists(database_folder):
            os.makedirs(database_folder)
        text_path = os.path.join(raw_data_folder, f.lower() + '.txt')
        with open(text_path) as f:
            text = f.read()
            m.generateDatabase(text)
        return m


if __name__ == '__main__':
    cmd = sys.argv[1]
    forum = sys.argv[2] if len(sys.argv) > 2 else ""
    m = forum_to_chain(forum)
    if cmd == 'babble':
        print(m.generateString())
    elif cmd == 'ask':
        seed = sys.argv[3]
        m = forum_to_chain(forum)
        print(m.generateStringWithSeed(seed))
    else:
        print("I don't know.")
