#!/usr/bin/env bash

export ORGANIZATION="niwinz";
export ENV_IMG_NAME="$ORGANIZATION/happy-homes";
export ENV_NAME="happy-homes";

export CURRENT_USER_ID=$(id -u);

set -e

function build-image {
    set +e;

    pushd docker/;

    echo "Build local only $ENV_IMG_NAME:latest image";
    docker build -t $ENV_IMG_NAME:latest .;

    popd;
}

function run-env-shell {
    docker volume create ${ENV_NAME}_user_data;
    docker run -ti --rm \
           --mount source=${ENV_NAME}_user_data,type=volume,target=/home/niwinz/ \
           --mount source=`pwd`,type=bind,target=/home/niwinz/happy-homes \
           -e EXTERNAL_UID=$CURRENT_USER_ID \
           -p 4069:4069 \
           -p 4070:4070 \
           -w /home/niwinz/happy-homes \
           $ENV_IMG_NAME:latest sudo -EH -u niwinz $@
}

function usage {
    echo "AI SANDBOX MANAGER"
    echo "USAGE: $0 OPTION"
    echo "Options:"
    echo "- build-env                     Build docker development oriented image"
    echo "- create-env                    Create the development oriented docker compose service."
    echo "- start-env                     Start the development oriented docker compose service."
    echo "- stop-env                      Stops the development oriented docker compose service."
    echo "- drop-env                      Remove the development oriented docker compose containers, volumes and clean images."
    echo "- run-env                       Attaches to the running env container and starts development environment"
    # echo "- run-env-shell                 Attaches to the running env container and starts a bash shell."
    # echo "- isolated-shell                   Starts a bash shell in a new env container."
}

case $1 in
    version)
        print-current-version
        ;;

    ## env related commands
    build-env)
        shift;
        build-image $@;
        ;;

    create-env)
        create-env ${@:2}
        ;;

    start-env)
        start-env ${@:2}
        ;;
    run-env)
        run-env-shell ${@:2}
        ;;

    stop-env)
        stop-env ${@:2}
        ;;
    drop-env)
        drop-env ${@:2}
        ;;
    *)
        usage
        ;;
esac
