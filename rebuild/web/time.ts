/** Interpret the form's wall time in the church timezone, independent of the device. */
export function churchDate(value: string): Date {
  if(!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)) throw new Error('Informe uma data e horário válidos.')
  const [year,month,day,hour,minute]=value.split(/[-T:]/).map(Number)
  const nominal=Date.UTC(year,month-1,day,hour,minute)
  const format=new Intl.DateTimeFormat('sv-SE',{timeZone:'America/Sao_Paulo',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'})
  const wall=(instant: number)=>format.format(new Date(instant)).replace(' ','T')
  const local=wall(nominal)
  const [ly,lm,ld,lh,lmin]=local.split(/[-T:]/).map(Number)
  const offset=Date.UTC(ly,lm-1,ld,lh,lmin)-nominal
  const result=new Date(nominal-offset)
  if(wall(result.getTime())!==value) throw new Error('Horário inválido no fuso da igreja.')
  return result
}
