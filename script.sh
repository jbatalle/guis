#!/bin/bash
SESSION='sodales'

# -2: forces 256 colors, 
byobu-tmux -2 new-session -d -s $SESSION

# dev window
byobu-tmux rename-window -t $SESSION:0 'IML'
byobu-tmux send-keys "cd iml" C-m
byobu-tmux send-keys "rake start" C-m

byobu-tmux new-window -t $SESSION:1 -n 'Auth'
byobu-tmux send-keys "cd mod_authentication" C-m
byobu-tmux send-keys "rake start" C-m

byobu-tmux new-window -t $SESSION:2 -n 'UI'
byobu-tmux send-keys "cd sodales" C-m
byobu-tmux send-keys "grunt serve" C-m

# Set default window as the dev split plane
byobu-tmux select-window -t $SESSION:0

