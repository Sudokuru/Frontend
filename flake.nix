{
  description = "Nix development environment for Frontend";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-26.05";
    utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, utils }:
    utils.lib.eachDefaultSystem (system: 
      let
        pkgs = import nixpkgs {
          inherit system;
        };
        
      in
      {
        devShells.default = pkgs.mkShell {
          name = "Sudokuru";
          buildInputs = with pkgs; [
            git
            jq
            pre-commit
            nodejs_26
            bun
            cargo
            rustc
            gh
          ];

          shellHook = ''
            echo "⚡ Pinned NixOS 26.05 Development Environment Activated ⚡"
            export PROJECT_ROOT=$(pwd)
            pre-commit install
            stools() {
              echo "Available tools: $(git --version), $(jq --version), node $(node --version), npm $(npm --version), $(pre-commit --version), bun $(bun --version), $(cargo --version), $(rustc --version)"
            }
            stools
            export PS1="(\w) $PS1"
          '';
        };
      });
}
