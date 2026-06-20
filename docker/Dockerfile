FROM ubuntu:26.04 AS base

ENV LANG='C.UTF-8' \
    LC_ALL='C.UTF-8' \
    DEBIAN_FRONTEND=noninteractive

RUN sed -i 's|http://archive.ubuntu.com/ubuntu/|http://mirror.init7.net/ubuntu/|g' /etc/apt/sources.list.d/ubuntu.sources

RUN set -ex; \
    # 1. Forzar a APT a no usar caché de red y descargar archivos uno a uno
    echo "Acquire::http::No-Cache true;" > /etc/apt/apt.conf.d/99custom; \
    echo "Acquire::http::Pipeline-Depth 0;" >> /etc/apt/apt.conf.d/99custom; \
    \
    # 2. Limpiar cualquier residuo previo
    rm -rf /var/lib/apt/lists/*; \
    \
    # 3. Actualizar e instalar
    apt-get update; \
    apt-get install -y --no-install-recommends \
        python3 \
        unzip \
        rsync \
        wget \
        sudo \
        tmux \
        vim \
        curl \
        bash \
        git \
        ripgrep \
        ca-certificates \
        binutils; \
    \
    # 4. Limpieza final y borrar configuración temporal
    apt-get clean; \
    rm -rf /var/lib/apt/lists/*; \
    rm /etc/apt/apt.conf.d/99custom


################################################################################
## NODE SETUP
################################################################################

FROM base AS setup-node

ENV NODE_VERSION=v24.15.0 \
    PATH=/opt/node/bin:$PATH

RUN set -eux; \
    ARCH="$(dpkg --print-architecture)"; \
    case "${ARCH}" in \
       aarch64|arm64) \
         OPENSSL_ARCH='linux-aarch64'; \
         BINARY_URL="https://nodejs.org/dist/${NODE_VERSION}/node-${NODE_VERSION}-linux-arm64.tar.gz"; \
         ;; \
       amd64|x86_64) \
         OPENSSL_ARCH='linux-x86_64'; \
         BINARY_URL="https://nodejs.org/dist/${NODE_VERSION}/node-${NODE_VERSION}-linux-x64.tar.gz"; \
         ;; \
       *) \
         echo "Unsupported arch: ${ARCH}"; \
         exit 1; \
         ;; \
    esac; \
    curl -LfsSo /tmp/nodejs.tar.gz ${BINARY_URL}; \
    mkdir -p /opt/node; \
    cd /opt/node; \
    tar -xf /tmp/nodejs.tar.gz --strip-components=1; \
    chown -R root /opt/node; \
    find /opt/node/include/node/openssl/archs -mindepth 1 -maxdepth 1 ! -name "$OPENSSL_ARCH" -exec rm -rf {} \; ; \
    corepack enable; \
    rm -rf /tmp/nodejs.tar.gz;


################################################################################
## CADDYSERVER SETUP
################################################################################

FROM base AS setup-caddy

ENV CADDY_VERSION=2.11.2

RUN set -eux; \
    ARCH="$(dpkg --print-architecture)"; \
    case "${ARCH}" in \
       aarch64|arm64) \
         BINARY_URL="https://github.com/caddyserver/caddy/releases/download/v${CADDY_VERSION}/caddy_${CADDY_VERSION}_linux_arm64.tar.gz"; \
         ;; \
       amd64|x86_64) \
         BINARY_URL="https://github.com/caddyserver/caddy/releases/download/v${CADDY_VERSION}/caddy_${CADDY_VERSION}_linux_amd64.tar.gz"; \
         ;; \
       *) \
         echo "Unsupported arch: ${ARCH}"; \
         exit 1; \
         ;; \
    esac; \
    curl -LfsSo /tmp/caddy.tar.gz ${BINARY_URL}; \
    mkdir -p /tmp/caddy; \
    cd /tmp/caddy; \
    tar -xf /tmp/caddy.tar.gz; \
    chown -R root /tmp/caddy; \
    mv /tmp/caddy/caddy /usr/bin/; \
    rm -rf /tmp/caddy.tar.gz; \
    rm -rf /tmp/caddy;

################################################################################
## JVM SETUP
################################################################################

FROM base AS setup-jvm

# https://clojure.org/releases/tools
ENV CLOJURE_VERSION=1.12.4.1618

RUN set -eux; \
    ARCH="$(dpkg --print-architecture)"; \
    case "${ARCH}" in \
       aarch64|arm64) \
         ESUM='cc1b459dc442d7422b46a3b5fe52acaea54879fa7913e29a05650cef54687f5f'; \
         BINARY_URL='https://cdn.azul.com/zulu/bin/zulu26.30.11-ca-jdk26.0.1-linux_aarch64.tar.gz'; \
         ;; \
       amd64|x86_64) \
         ESUM='7d6663ea8d4298df65de065e32f9f449745ff607d30ba5d13777cb92e9d4613d'; \
         BINARY_URL='https://cdn.azul.com/zulu/bin/zulu26.30.11-ca-jdk26.0.1-linux_x64.tar.gz'; \
         ;; \
       *) \
         echo "Unsupported arch: ${ARCH}"; \
         exit 1; \
         ;; \
    esac; \
    curl -LfsSo /tmp/openjdk.tar.gz ${BINARY_URL}; \
    echo "${ESUM} */tmp/openjdk.tar.gz" | sha256sum -c -; \
    mkdir -p /opt/jdk; \
    cd /opt/jdk; \
    tar -xf /tmp/openjdk.tar.gz --strip-components=1; \
    rm -rf /tmp/openjdk.tar.gz;

RUN set -ex; \
    curl -LfsSo /tmp/clojure.sh https://download.clojure.org/install/linux-install-$CLOJURE_VERSION.sh; \
    chmod +x /tmp/clojure.sh; \
    mkdir -p /opt/clojure; \
    /tmp/clojure.sh --prefix /opt/clojure; \
    rm -rf /tmp/clojure.sh;

################################################################################
## UTILS SETUP
################################################################################

FROM base AS setup-utils

ENV BABASHKA_VERSION=1.12.208 \
    GITHUB_CLI_VERSION=2.91.0

RUN set -ex; \
    cd /opt; \
    mkdir -p /opt/utils/bin; \
    git clone --depth=1 https://github.com/romkatv/powerlevel10k.git;

RUN set -ex; \
    ARCH="$(dpkg --print-architecture)"; \
    case "${ARCH}" in \
       aarch64|arm64) \
         BINARY_URL="https://github.com/babashka/babashka/releases/download/v$BABASHKA_VERSION/babashka-$BABASHKA_VERSION-linux-aarch64-static.tar.gz"; \
         ;; \
       amd64|x86_64) \
         BINARY_URL="https://github.com/babashka/babashka/releases/download/v$BABASHKA_VERSION/babashka-$BABASHKA_VERSION-linux-amd64-static.tar.gz"; \
         ;; \
       *) \
         echo "Unsupported arch: ${ARCH}"; \
         exit 1; \
         ;; \
    esac; \
    cd /tmp; \
    curl -LfsSo /tmp/babashka.tar.gz ${BINARY_URL}; \
    cd /opt/utils/bin; \
    tar -xf /tmp/babashka.tar.gz; \
    rm -rf /tmp/babashka.tar.gz;

RUN set -ex; \
    ARCH="$(dpkg --print-architecture)"; \
    case "${ARCH}" in \
       aarch64|arm64) \
         BINARY_URL="https://github.com/zellij-org/zellij/releases/download/v0.44.1/zellij-aarch64-unknown-linux-musl.tar.gz"; \
         ;; \
       amd64|x86_64) \
         BINARY_URL="https://github.com/zellij-org/zellij/releases/download/v0.44.1/zellij-x86_64-unknown-linux-musl.tar.gz"; \
         ;; \
       *) \
         echo "Unsupported arch: ${ARCH}"; \
         exit 1; \
         ;; \
    esac; \
    cd /tmp; \
    curl -LfsSo /tmp/zellij.tar.gz ${BINARY_URL}; \
    cd /opt/utils/bin; \
    tar -xf /tmp/zellij.tar.gz; \
    rm -rf /tmp/zellij.tar.gz;

RUN set -ex; \
    ARCH="$(dpkg --print-architecture)"; \
    case "${ARCH}" in \
       aarch64|arm64) \
         BINARY_URL="https://github.com/cli/cli/releases/download/v${GITHUB_CLI_VERSION}/gh_${GITHUB_CLI_VERSION}_linux_arm64.tar.gz"; \
         ;; \
       amd64|x86_64) \
         BINARY_URL="https://github.com/cli/cli/releases/download/v${GITHUB_CLI_VERSION}/gh_${GITHUB_CLI_VERSION}_linux_amd64.tar.gz"; \
         ;; \
       *) \
         echo "Unsupported arch: ${ARCH}"; \
         exit 1; \
         ;; \
    esac; \
    cd /tmp; \
    curl -LfsSo /tmp/gh.tar.gz ${BINARY_URL}; \
    mkdir /opt/gh; \
    cd /opt/gh; \
    tar -xf /tmp/gh.tar.gz; \
    rm -rf /tmp/gh.tar.gz;


################################################################################
## DEVENV BASE
################################################################################

FROM base AS devenv-base

RUN set -ex; \
    apt-get -qq update; \
    apt-get -qqy install --no-install-recommends \
      gnupg2 \
      rlwrap \
      file \
      less \
      jq \
      fd-find \
      bat \
      zsh \
      \
      fontconfig \
      woff-tools \
      woff2 \
      python3-tabulate \
      fontforge \
      \
      pandoc \
      texlive-xetex \
      texlive-fonts-extra \
      texlive-fonts-recommended \
      xvfb \
      fonts-noto-color-emoji \
      fonts-unifont \
      libfontconfig1 \
      libfontconfig-dev \
      libfreetype6 \
      libfreetype-dev \
      xfonts-cyrillic \
      xfonts-scalable \
      fonts-liberation \
      fonts-ipafont-gothic \
      fonts-wqy-zenhei \
      fonts-tlwg-loma-otf \
      fonts-freefont-ttf \
      poppler-utils \
      python3-fonttools \
      fonts-cardo \
      fonts-sil-gentiumplus \
      fonts-noto-core \
      fonts-crosextra-caladea \
      fonts-inter \
      fonts-ebgaramond \
      \
      libasound2t64 \
      libatk-bridge2.0-0t64 \
      libatk1.0-0t64 \
      libatspi2.0-0t64 \
      libcairo2 \
      libcups2t64 \
      libdbus-1-3 \
      libdrm2 \
      libgbm1 \
      libglib2.0-0t64 \
      libnspr4 \
      libnss3 \
      libpango-1.0-0 \
      libx11-6 \
      libxcb1 \
      libxcomposite1 \
      libxdamage1 \
      libxext6 \
      libxfixes3 \
      libxkbcommon0 \
      libxrandr2 \
      \
      libpng16-16 \
      libjpeg-turbo8 \
      libtiff6 \
      libwebp7 \
      libopenexr-3-1-30 \
      libfreetype6 \
      libfontconfig1 \
      libglib2.0-0 \
      # libxml2 \
      liblcms2-2 \
      libheif1 \
      libopenjp2-7 \
      libzstd1 \
      librsvg2-2 \
      libgomp1 \
      libwebpmux3 \
      libwebpdemux2 \
      # libzip4t64 \
    ; \
    rm -rf /var/lib/apt/lists/*;

RUN set -ex; \
    usermod -l niwinz -d /home/niwinz -G users -s /bin/bash ubuntu; \
    passwd niwinz -d; \
    echo "niwinz ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers


################################################################################
## DEVENV
################################################################################

FROM devenv-base AS devenv
LABEL maintainer="Andrey Antukh <niwi@niwi.nz>"

ENV LANG='C.UTF-8' \
    LC_ALL='C.UTF-8' \
    DEBIAN_FRONTEND="noninteractive" \
    JAVA_HOME="/opt/jdk" \
    PATH="/opt/jdk/bin:/opt/gh/bin:/opt/utils/bin:/opt/clojure/bin:/opt/node/bin:$PATH"

COPY --from=setup-jvm /opt/jdk /opt/jdk
COPY --from=setup-jvm /opt/clojure /opt/clojure
COPY --from=setup-node /opt/node /opt/node
COPY --from=setup-utils /opt/utils /opt/utils
COPY --from=setup-utils /opt/gh /opt/gh
COPY --from=setup-utils /opt/powerlevel10k /opt/powerlevel10k
COPY --from=setup-caddy /usr/bin/caddy /usr/bin/caddy

COPY files/zshrc               /root/.zshrc
COPY files/bashrc              /root/.bashrc
COPY files/vimrc               /root/.vimrc
COPY files/tmux.conf           /root/.tmux.conf
COPY files/sudoers             /etc/sudoers
COPY files/p10k.zsh            /root/.p10k.zsh

COPY files/start-tmux.sh       /home/start-tmux.sh
COPY files/entrypoint.sh       /home/entrypoint.sh

ENTRYPOINT ["/home/entrypoint.sh"]
# CMD ["/home/init.sh"]
