#!/usr/bin/env bash

# sudo chown niwinz:users /home/niwinz

cd ~;

source ~/.bashrc

tmux -2 new-session -d -s ai-sandbox

tmux rename-window -t ai-sandbox:0 'main'
tmux select-window -t ai-sandbox:0

tmux -2 attach-session -t ai-sandbox
