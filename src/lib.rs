use mlua::chunk::Compiler;
use napi::bindgen_prelude::*;
use napi_derive::napi;

/// Compile options object passed from JS
#[napi(object)]
pub struct CompileOptions {
  /// 0..=2 (default 1)
  pub optimization_level: Option<u8>,
  /// 0..=2 (default 0)
  pub coverage_level: Option<u8>,
  /// 0..=2 (default 1)
  pub debug_level: Option<u8>,
}

impl CompileOptions {
  fn to_compiler(&self) -> Compiler {
    let mut c = Compiler::new();
    let opt = self.optimization_level.unwrap_or(1);
    let cov = self.coverage_level.unwrap_or(0);
    let dbg = self.debug_level.unwrap_or(1);

    c = c.set_optimization_level(opt);
    c = c.set_coverage_level(cov);
    c = c.set_debug_level(dbg);
    c
  }
}

/// Compiles the given Luau code into bytecode or throws an error.
#[napi]
pub fn compile_luau(source: String, options: Option<CompileOptions>) -> Result<Buffer> {
  let opts = options.unwrap_or(CompileOptions {
    optimization_level: None,
    coverage_level: None,
    debug_level: None,
  });

  let compiler = opts.to_compiler();

  let bytecode = compiler
    .compile(source.into_bytes())
    .map_err(|e| Error::from_reason(format!("compile error: {}", e)))?;

  Ok(Buffer::from(bytecode))
}
