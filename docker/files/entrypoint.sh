#!/usr/bin/env bash

set -e

usermod -u ${EXTERNAL_UID:-1000} niwinz;

cp /root/.bashrc /home/niwinz/.bashrc
cp /root/.zshrc /home/niwinz/.zshrc
cp /root/.vimrc /home/niwinz/.vimrc
cp /root/.tmux.conf /home/niwinz/.tmux.conf
cp /root/.p10k.zsh /home/niwinz/.p10k.zsh

chown niwinz:users /home/niwinz

exec "$@"
