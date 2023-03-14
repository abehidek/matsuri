{
  description = "Shell environments for development";
  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixpkgs-unstable";
    stable.url = "github:nixos/nixpkgs/nixos-22.11";
  };
  outputs = {
    self,
    nixpkgs,
    stable,
    ...
  } @ inputs: let
    inherit (self) outputs;
    supportedSystems = [ "x86_64-linux" ];
    forAllSystems = nixpkgs.lib.genAttrs supportedSystems;
  in rec {
    devShells = forAllSystems (system: {
      default = let
        pkgs = nixpkgs.legacyPackages.${system};
        node16Pkgs = import nixpkgs {
          inherit system;
          overlays = [(final: prev: { nodejs = prev.nodejs-16_x; })];
        };
      in pkgs.mkShell {
        nativeBuildInputs = [ pkgs.bashInteractive ];
        buildInputs = [
          node16Pkgs.nodejs
          node16Pkgs.nodePackages.prisma
          node16Pkgs.nodePackages.pnpm
          pkgs.turbo
          pkgs.sqlite
          pkgs.redis
        ];
        shellHook = ''
          echo -e "\n\033[0;35m >>> Welcome to Matsuri \033[0m \n"
        '';
        PRISMA_MIGRATION_ENGINE_BINARY = "${pkgs.prisma-engines}/bin/migration-engine";
        PRISMA_QUERY_ENGINE_BINARY = "${pkgs.prisma-engines}/bin/query-engine";
        PRISMA_QUERY_ENGINE_LIBRARY = "${pkgs.prisma-engines}/lib/libquery_engine.node";
        PRISMA_INTROSPECTION_ENGINE_BINARY = "${pkgs.prisma-engines}/bin/introspection-engine";
        PRISMA_FMT_BINARY = "${pkgs.prisma-engines}/bin/prisma-fmt";
        TURBO_BINARY_PATH = "${pkgs.turbo}/bin/turbo";
      };
    });
  };
}
